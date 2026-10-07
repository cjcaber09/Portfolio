import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Experience } from './Experience'
import { experience } from '@/data/content'

describe('Experience', () => {
  it('renders every role, company, and first bullet', () => {
    render(<Experience />)
    // Scoped by heading, not a document-wide getByText: several roles share
    // a plain "Web Developer" title (and both the outer <ol> and each role's
    // bullet <ul> expose listitem-role children, so getAllByRole('listitem')
    // can't cleanly isolate just the 5 role entries either). Each role has
    // exactly one <h3>, in the same order as `experience`, so headings give
    // an unambiguous 1:1 scope per entry. Plain .includes() rather than a
    // regex also means a company name with characters like the parentheses
    // in "Advanced Technology Integrations (ATI LLC)" needs no escaping.
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(experience.length)
    experience.forEach((role, index) => {
      const heading = headings[index]
      expect(heading.textContent).toContain(role.title)
      expect(heading.textContent).toContain(role.company)
      const item = within(heading.closest('li') as HTMLElement)
      expect(item.getByText(role.bullets[0])).toBeInTheDocument()
    })
  })

  it("lists each role's stack as links to the technology's pin in the block diagram", () => {
    render(<Experience />)
    const seahaven = screen.getByRole('heading', { name: /Seahaven Business Solutions/ }).closest('li')!
    const stack = within(seahaven).getByRole('list', { name: 'Stack' })
    expect(within(stack).getByRole('link', { name: /^MySQL/ })).toHaveAttribute('href', '#tech-mysql')
    expect(within(stack).queryByRole('link', { name: /^React/ })).not.toBeInTheDocument()
  })
})
