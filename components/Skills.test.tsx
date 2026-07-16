import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skills } from './Skills'
import { skills } from '@/data/content'

describe('Skills', () => {
  it('renders every category and its items', () => {
    render(<Skills />)
    skills.forEach((group) => {
      expect(screen.getByText(group.category)).toBeInTheDocument()
      group.items.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument()
      })
    })
  })
})
