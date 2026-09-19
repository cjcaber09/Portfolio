import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomeIntro } from './HomeIntro'
import { homeOneLiners } from '@/data/content'

describe('HomeIntro', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('renders the static reduced-motion intro with the heading, every one-liner, and the CTA', () => {
    render(<HomeIntro />)
    expect(screen.getByRole('heading', { level: 1, name: 'CeeDev' })).toBeInTheDocument()
    homeOneLiners.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument()
    })
    expect(screen.getByRole('link', { name: 'View My Work' })).toHaveAttribute('href', '/about')
  })
})
