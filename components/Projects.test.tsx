import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
