import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { Projects } from '../Projects'
import { projects } from '@/data/content'
import { projectAnchorId } from './sections'

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function entry(title: string) {
  const project = projects.find((candidate) => candidate.title === title)!
  return { project, element: document.getElementById(projectAnchorId(project))! }
}

function openDialog(element: HTMLElement) {
  return element.querySelector('dialog[open]') as HTMLDialogElement | null
}

// The first project with a phone figure, and the first with a demo video.
const phoneProject = projects.find((project) => project.figure && project.figure.height > project.figure.width)!
const videoProject = projects.find((project) => project.figure?.video)!

describe('MediaViewer', () => {
  it('opens a phone screen full size, numbered within its figure', () => {
    render(<Projects />)
    const { project, element } = entry(phoneProject.title)
    const shot = project.figure!.screens[1]

    fireEvent.click(within(element).getByRole('button', { name: new RegExp(escape(shot.description)) }))

    const dialog = openDialog(element)!
    expect(dialog).not.toBeNull()
    expect(within(dialog).getByText(`2 / ${project.figure!.screens.length}`)).toBeInTheDocument()
    expect(within(dialog).getAllByAltText(shot.description).length).toBeGreaterThan(0)
  })

  it('swaps the stage from the index, then steps through the viewer with the arrow keys', () => {
    render(<Projects />)
    const { project, element } = entry(videoProject.title)
    const third = project.figure!.screens[2]
    const total = project.figure!.screens.length + 1

    fireEvent.click(within(element).getByRole('button', { name: new RegExp(`${escape(third.name)}$`), pressed: false }))
    const stage = within(element).getByRole('button', { name: new RegExp(`^${escape(third.description)}`) })
    expect(within(stage).getByAltText(third.description)).toBeInTheDocument()

    fireEvent.click(stage)
    const dialog = openDialog(element)!
    expect(within(dialog).getByText(`3 / ${total}`)).toBeInTheDocument()

    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(within(dialog).getByText(`4 / ${total}`)).toBeInTheDocument()
    fireEvent.keyDown(dialog, { key: 'Home' })
    expect(within(dialog).getByText(`1 / ${total}`)).toBeInTheDocument()
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' })
    expect(within(dialog).getByText(`${total} / ${total}`)).toBeInTheDocument()
  })

  it('plays the demo video from the entry’s demo button, loading it only when played, with chapters that seek', () => {
    render(<Projects />)
    const { project, element } = entry(videoProject.title)
    const video = project.figure!.video!

    fireEvent.click(within(element).getByRole('button', { name: /Demo Video/ }))

    const dialog = openDialog(element)!
    const player = dialog.querySelector('video')!
    expect(player).toHaveAttribute('preload', 'none')
    expect(player).toHaveAttribute('poster', video.poster)
    expect(player.querySelector('source')).toHaveAttribute('src', video.src)

    const chapter = video.chapters[3]
    fireEvent.click(within(dialog).getByRole('button', { name: new RegExp(`${chapter.time}\\s*${escape(chapter.label)}`) }))
    const [minutes, seconds] = chapter.time.split(':').map(Number)
    expect(player.currentTime).toBe(minutes * 60 + seconds)
  })

  it('jumps from the filmstrip, and closes from its button or a click on the empty desk, not the image', () => {
    render(<Projects />)
    const { project, element } = entry(videoProject.title)
    const first = project.figure!.screens[0]

    fireEvent.click(within(element).getByRole('button', { name: new RegExp(`^${escape(first.description)}`) }))
    let dialog = openDialog(element)!
    fireEvent.click(within(dialog).getByRole('button', { name: new RegExp(`\\.2 ${escape(project.figure!.screens[1].name)}$`) }))
    expect(within(dialog).getByText(`2 / ${project.figure!.screens.length + 1}`)).toBeInTheDocument()

    fireEvent.click(within(dialog).getAllByAltText(project.figure!.screens[1].description)[0])
    expect(openDialog(element)).not.toBeNull()

    fireEvent.click(dialog.querySelector('[data-viewer-empty]')!)
    expect(openDialog(element)).toBeNull()

    fireEvent.click(within(element).getByRole('button', { name: new RegExp(`^${escape(first.description)}`) }))
    dialog = openDialog(element)!
    fireEvent.click(within(dialog).getByRole('button', { name: /^Close/ }))
    expect(openDialog(element)).toBeNull()
    expect(screen.queryAllByRole('dialog')).toHaveLength(0)
  })
})
