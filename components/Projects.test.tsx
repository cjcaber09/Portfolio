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

  it('never renders literal TODO text', () => {
    render(<Projects />)
    expect(screen.queryByText(/TODO/i)).not.toBeInTheDocument()
  })

  it('renders a link with the correct href and label only for projects that define one', () => {
    render(<Projects />)
    expect(projects.some((project) => project.link)).toBe(true)
    expect(projects.some((project) => !project.link)).toBe(true)

    projects.forEach((project) => {
      const card = screen.getByText(project.title).closest('div') as HTMLElement
      const links = within(card).queryAllByRole('link')
      if (project.link) {
        expect(links).toHaveLength(1)
        expect(links[0]).toHaveAttribute('href', project.link)
        expect(links[0]).toHaveTextContent(project.linkLabel ?? 'View Demo')
      } else {
        expect(links).toHaveLength(0)
      }
    })
  })
})
