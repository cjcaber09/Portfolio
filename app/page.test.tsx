import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'
import { ThemeProvider } from '@/components/ThemeProvider'

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
  expect(
    await screen.findByRole('link', { name: 'View My Work' }, { timeout: 5000 })
  ).toBeInTheDocument()
})
