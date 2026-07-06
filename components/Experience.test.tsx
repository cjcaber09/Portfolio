import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
