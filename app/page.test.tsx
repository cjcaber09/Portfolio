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

test('Home page renders the shared site nav and the (reduced-motion) intro content', async () => {
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
  // The intro arrives through a dynamic import that pulls in three.js. On a
  // cold, fully parallel run that import alone has taken over 5s, so the
  // first find waits up to 15s, and the test's own limit outlasts it. Once
  // the heading is there the rest of the intro is too.
  expect(
    await screen.findByRole('heading', { level: 1, name: 'CeeDev' }, { timeout: 15000 })
  ).toBeInTheDocument()
  expect(screen.getByText(homeWordmarkName)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'View My Work' })).toBeInTheDocument()
}, 20000)
