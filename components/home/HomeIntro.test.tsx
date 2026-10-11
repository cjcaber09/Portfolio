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

  it('sets the cover in the datasheet system: sheet tokens that follow the theme, no gradients', () => {
    const { container } = render(<HomeIntro />)
    homeOneLiners.forEach(({ description }) => {
      // Supporting lines are ink-2, a `ds` token the .datasheet wrapper
      // redefines per theme, never a fixed colour that vanishes on one desk.
      expect(screen.getByText(description).className).toContain('text-ds-ink-2')
    })
    expect(container.innerHTML).not.toMatch(/gradient|bg-clip-text|emerald|slate-/)
    expect(screen.getByRole('link', { name: 'View My Work' }).className).toContain('bg-ds-accent')
  })
})
