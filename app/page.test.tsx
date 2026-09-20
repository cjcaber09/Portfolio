import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'
import { ThemeProvider } from '@/components/ThemeProvider'
import { homeWordmarkName } from '@/data/content'

const originalMatchMedia = window.matchMedia

beforeEach(() => {
  // Query-aware: '(prefers-reduced-motion: reduce)' must match so this
  // test exercises StaticIntro (the only branch jsdom can render — the
  // Canvas branch needs a real WebGL context). Any other query (notably
  // the '(max-width: 639px)' narrow-viewport check) defaults to false so
  // the two conditions stay independently controllable.
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

test('Home page renders Nav and the (reduced-motion) intro content', async () => {
  render(
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  )
  expect(screen.getByRole('link', { name: 'CeeDev' })).toBeInTheDocument()
  expect(
    await screen.findByRole('heading', { level: 1, name: 'CeeDev' }, { timeout: 5000 })
  ).toBeInTheDocument()
  expect(screen.getByText(homeWordmarkName)).toBeInTheDocument()
  expect(
    await screen.findByRole('link', { name: 'View My Work' }, { timeout: 5000 })
  ).toBeInTheDocument()
})
