import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'
import { summary } from '@/data/content'

describe('About', () => {
  it('renders the professional summary', () => {
    render(<About />)
    expect(screen.getByText(summary)).toBeInTheDocument()
  })
})
