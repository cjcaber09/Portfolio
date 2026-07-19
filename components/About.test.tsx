import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'
import { summary, coreCompetencies } from '@/data/content'

describe('About', () => {
  it('renders the professional summary', () => {
    render(<About />)
    expect(screen.getByText(summary)).toBeInTheDocument()
  })

  it('renders every core competency', () => {
    render(<About />)
    expect(screen.getByText('Core Competencies')).toBeInTheDocument()
    coreCompetencies.forEach((competency) => {
      expect(screen.getByText(new RegExp(competency))).toBeInTheDocument()
    })
  })
})
