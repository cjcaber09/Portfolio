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
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      profile.linkedin
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', profile.github)
  })
})
