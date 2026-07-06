import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { profile } from '@/data/content'

describe('Hero', () => {
  it('renders the profile name, title, and tagline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument()
    expect(screen.getByText(profile.title)).toBeInTheDocument()
    expect(screen.getByText(profile.tagline)).toBeInTheDocument()
  })

  it('links the resume download button to /resume.pdf', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /download resume/i })).toHaveAttribute(
      'href',
      '/resume.pdf'
    )
  })
})
