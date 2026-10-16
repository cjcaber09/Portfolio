import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Projects } from './Projects'
import { projects } from '@/data/content'

describe('Projects', () => {
  it('renders every project title, description, and tech tag', () => {
    render(<Projects />)
    projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument()
      expect(screen.getByText(project.description)).toBeInTheDocument()
      project.tech.forEach((tech) => {
        expect(screen.getAllByText(tech).length).toBeGreaterThan(0)
      })
    })
  })

  it('shows each project’s screenshots as a numbered figure after Figure 1, every capture linking to its full size', () => {
    render(<Projects />)
    const withFigures = projects.filter((project) => project.figure)
    expect(withFigures.length).toBeGreaterThan(1)

    withFigures.forEach((project, index) => {
      const escapedTitle = project.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const figure = screen.getByRole('figure', { name: new RegExp(`^Figure ${index + 2}\\. ${escapedTitle}:`) })
      const screens = project.figure!.screens

      // A screen captured in both themes ships both (CSS shows the one
      // matching the page); a screen captured in one theme ships just that.
      screens.forEach((shot) => {
        expect(within(figure).getAllByAltText(shot.description)).toHaveLength(shot.srcDark ? 2 : 1)
        expect(within(figure).getByText(shot.name)).toBeInTheDocument()
      })
      expect(within(figure).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(
        screens.flatMap((shot) => (shot.srcDark ? [shot.src, shot.srcDark] : [shot.src]))
      )
    })
  })

  it('never renders literal TODO text', () => {
    render(<Projects />)
    expect(screen.queryByText(/TODO/i)).not.toBeInTheDocument()
  })

  it('renders a link button for every project link, with correct href and label', () => {
    render(<Projects />)
    expect(projects.some((project) => (project.links?.length ?? 0) > 0)).toBe(true)
    expect(projects.some((project) => (project.links?.length ?? 0) === 0)).toBe(true)
    expect(projects.some((project) => (project.links?.length ?? 0) > 1)).toBe(true)

    projects.forEach((project) => {
      const card = screen.getByText(project.title).closest('div') as HTMLElement
      const links = within(card).queryAllByRole('link')
      const expectedLinks = project.links ?? []
      expect(links).toHaveLength(expectedLinks.length)
      expectedLinks.forEach((expected, index) => {
        expect(links[index]).toHaveAttribute('href', expected.url)
        expect(links[index]).toHaveTextContent(expected.label)
      })
    })
  })
})
