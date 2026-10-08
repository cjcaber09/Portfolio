import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'
import { profile } from '@/data/content'

describe('Contact', () => {
  it('renders mailto, tel, LinkedIn, and GitHub links', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`
    )
    expect(screen.getByRole('link', { name: profile.phone })).toHaveAttribute(
      'href',
      'tel:+639777926148'
    )
    // LinkedIn and GitHub links show the handle itself, so a recruiter can
    // read and copy it; the channel name labels the row instead.
    expect(screen.getByRole('link', { name: 'linkedin.com/in/carljohn09' })).toHaveAttribute(
      'href',
      profile.linkedin
    )
    expect(screen.getByRole('link', { name: 'github.com/cjcaber09' })).toHaveAttribute(
      'href',
      profile.github
    )
  })

  it('offers the resume download alongside the contact channels', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: /download resume/i })).toHaveAttribute('href', '/resume.pdf')
  })
})
