import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'

// next/font/google only works under the Next.js compiler, which rewrites each
// font call at build time; under Vitest the import has no real functions.
// Each font a page loads gets a stand-in returning the shape next/font does.
vi.mock('next/font/google', () => {
  const font = () => ({ className: '', variable: '', style: { fontFamily: '' } })
  return { Archivo: font, Geist: font, Geist_Mono: font }
})
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jsdom does not implement IntersectionObserver; the /about nav uses it to
// track the current section.
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
})

// jsdom does not implement matchMedia; Framer Motion checks
// prefers-reduced-motion internally.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
