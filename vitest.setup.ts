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

// jsdom does not implement IntersectionObserver; the site nav uses it to
// track the current section.
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
})

// jsdom has <dialog> but not its showModal or close; the project media
// viewer opens one. These do what the viewer relies on: set `open`, and fire
// `close` when closed.
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.open = true
}
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  if (!this.open) return
  this.open = false
  this.dispatchEvent(new Event('close'))
}

// jsdom does not implement media playback; the viewer's chapter list plays
// the demo video from a chapter.
HTMLMediaElement.prototype.play = () => Promise.resolve()
HTMLMediaElement.prototype.pause = () => {}

// jsdom does not implement matchMedia; the / cover reads it for
// prefers-reduced-motion and the narrow-viewport check.
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
