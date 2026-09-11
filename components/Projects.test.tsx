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
