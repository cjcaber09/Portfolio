import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import { StackDiagram } from './StackDiagram'
import { experience, projects, stackLayers } from '@/data/content'
import { traceTechnology } from './traceStack'

describe('StackDiagram', () => {
  it('draws only technologies that some role or project actually names', () => {
    render(<StackDiagram />)
    const drawn = screen.getAllByRole('button').map((button) => button.textContent)
    const evidenced = stackLayers
      .flatMap((layer) => layer.technologies)
      .filter((technology) => {
        const trace = traceTechnology(technology, experience, projects)
        return trace.roles.length + trace.projects.length > 0
      })
      .map((technology) => technology.name)
    // Compared as sets: the diagram orders blocks by layout (Integrations sits
    // beside Server, Data below it), not by their order in stackLayers.
    expect([...drawn].sort()).toEqual([...evidenced].sort())
  })

  it('opens with React traced, listing the roles and projects that name it as links to their entries', () => {
    render(<StackDiagram />)
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'true')

    const readout = screen.getByRole('status')
    const profound = experience.findIndex((role) => role.company === 'Profound Logic')
    expect(within(readout).getByRole('link', { name: /Profound Logic/ })).toHaveAttribute(
      'href',
      '#role-profound-logic-web-developer-it-specialist'
    )
    expect(within(readout).getByRole('link', { name: /Profound Logic/ })).toHaveTextContent(
      `2.${profound + 1}`
    )
    expect(within(readout).getByRole('link', { name: /Messaging App/ })).toHaveAttribute(
      'href',
      '#project-messaging-app'
    )
  })

  it('retraces when another technology is selected', () => {
    render(<StackDiagram />)
    fireEvent.click(screen.getByRole('button', { name: 'MySQL' }))

    expect(screen.getByRole('button', { name: 'MySQL' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'false')
    const readout = screen.getByRole('status')
    expect(within(readout).getByRole('link', { name: /Seahaven Business Solutions/ })).toBeInTheDocument()
    expect(within(readout).queryByRole('link', { name: /Messaging App/ })).not.toBeInTheDocument()
  })

  it('selects the technology a link elsewhere on the page points at', () => {
    render(
      <>
        <a href="#tech-mysql">MySQL used here</a>
        <StackDiagram />
      </>
    )
    fireEvent.click(screen.getByRole('link', { name: 'MySQL used here' }))

    expect(screen.getByRole('button', { name: 'MySQL' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'MySQL' })).toHaveAttribute('id', 'tech-mysql')
    expect(within(screen.getByRole('status')).getByRole('link', { name: /Seahaven/ })).toBeInTheDocument()
  })

  it('captions the figure', () => {
    render(<StackDiagram />)
    expect(screen.getByRole('figure', { name: /functional block diagram/i })).toBeInTheDocument()
  })
})
