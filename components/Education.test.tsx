import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Education } from './Education'
import { education } from '@/data/content'

describe('Education', () => {
  it("renders every entry's dates, school, level, and degree when present", () => {
    render(<Education />)
    education.forEach((entry) => {
      expect(screen.getAllByText(entry.school).length).toBeGreaterThan(0)
      expect(screen.getByText(new RegExp(entry.dates))).toBeInTheDocument()
      expect(screen.getAllByText(new RegExp(entry.level)).length).toBeGreaterThan(0)
      if (entry.degree) {
        expect(screen.getByText(entry.degree)).toBeInTheDocument()
      }
    })
  })
})
