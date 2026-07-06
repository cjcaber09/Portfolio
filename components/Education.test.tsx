import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Education } from './Education'
import { education } from '@/data/content'

describe('Education', () => {
  it('renders the degree, school, dates, and location', () => {
    render(<Education />)
    expect(screen.getByText(education.degree)).toBeInTheDocument()
    expect(screen.getByText(education.school)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(education.dates))).toBeInTheDocument()
  })
})
