import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Experience } from './Experience'
import { experience } from '@/data/content'

describe('Experience', () => {
  it('renders every role, company, and first bullet', () => {
    render(<Experience />)
    experience.forEach((role) => {
      expect(screen.getByText(new RegExp(role.title))).toBeInTheDocument()
      expect(screen.getByText(new RegExp(role.company))).toBeInTheDocument()
      expect(screen.getByText(role.bullets[0])).toBeInTheDocument()
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
