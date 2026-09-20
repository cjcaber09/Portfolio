import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomeIntro } from './HomeIntro'
import { homeOneLiners, homeWordmarkName } from '@/data/content'

describe('HomeIntro', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    // Query-aware for the same reason as app/page.test.tsx: only
    // '(prefers-reduced-motion: reduce)' matches, so this test exercises
    // StaticIntro, the one branch renderable under jsdom.
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('renders the static reduced-motion intro with the heading, the name, every one-liner, and the CTA', () => {
    render(<HomeIntro />)
    expect(screen.getByRole('heading', { level: 1, name: 'CeeDev' })).toBeInTheDocument()
    expect(screen.getByText(homeWordmarkName)).toBeInTheDocument()
    homeOneLiners.forEach(({ title, description }) => {
      expect(screen.getByText(title)).toBeInTheDocument()
      expect(screen.getByText(description)).toBeInTheDocument()
    })
    expect(screen.getByRole('link', { name: 'View My Work' })).toHaveAttribute('href', '/about')
  })

  it('sets the headlines and supporting lines in theme-aware colours, not a fixed light-on-dark one', () => {
    render(<HomeIntro />)
    homeOneLiners.forEach(({ title, description }) => {
      // A gradient headline needs a light-theme and a dark-theme variant; a lone
      // fixed colour (the old text-slate-100) is invisible on the light background.
      const headline = screen.getByText(title)
      expect(headline.className).toContain('bg-clip-text')
      expect(headline.className).toContain('dark:bg-')
      // The supporting line needs a `dark:` colour paired with its light-theme one.
      const support = screen.getByText(description)
      expect(support.className).toMatch(/\btext-slate-\d+\b/)
      expect(support.className).toMatch(/\bdark:text-slate-\d+\b/)
    })
  })
})
