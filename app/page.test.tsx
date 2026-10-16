import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'
import { ThemeProvider } from '@/components/ThemeProvider'
import { homeWordmarkName } from '@/data/content'

// The page loads the intro through next/dynamic, which pulls in three.js
// inside the timed test body; on a cold, busy run that import alone has run
// past 15s. This test is about how the page is composed (nav plus intro), not
// about next/dynamic, so the loader is swapped for the intro itself, imported
// while the test file loads.
vi.mock('@/components/home/HomeIntroLoader', async () => {
  const { HomeIntro } = await import('@/components/home/HomeIntro')
  return { HomeIntroLoader: () => <HomeIntro /> }
})

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

test('Home page renders the shared site nav and the (reduced-motion) intro content', () => {
  const { container } = render(
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  )
  // The cover lives in the same datasheet world as /about.
  expect(container.querySelector('.datasheet')).not.toBeNull()
  expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Dark mode' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'CeeDev' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 1, name: 'CeeDev' })).toBeInTheDocument()
  expect(screen.getByText(homeWordmarkName)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'View My Work' })).toBeInTheDocument()
})
