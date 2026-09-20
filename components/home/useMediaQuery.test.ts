import { describe, it, expect, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from './useMediaQuery'

describe('useMediaQuery', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  function mockMatchMedia(initial: Record<string, boolean>) {
    const state = { ...initial }
    const listenersByQuery = new Map<string, Array<(event: MediaQueryListEvent) => void>>()

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return state[query] ?? false
      },
      media: query,
      addEventListener: (_: string, handler: (event: MediaQueryListEvent) => void) => {
        listenersByQuery.set(query, [...(listenersByQuery.get(query) ?? []), handler])
      },
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia

    return {
      fire(query: string, matches: boolean) {
        state[query] = matches
        for (const handler of listenersByQuery.get(query) ?? []) {
          handler({ matches } as MediaQueryListEvent)
        }
      },
    }
  }

  it('returns the initial match synchronously on first render', () => {
    mockMatchMedia({ '(min-width: 100px)': true })
    const { result } = renderHook(() => useMediaQuery('(min-width: 100px)'))
    expect(result.current).toBe(true)
  })

  it('responds to change events', () => {
    const media = mockMatchMedia({ '(min-width: 100px)': false })
    const { result } = renderHook(() => useMediaQuery('(min-width: 100px)'))
    expect(result.current).toBe(false)

    act(() => {
      media.fire('(min-width: 100px)', true)
    })

    expect(result.current).toBe(true)
  })

  it('returns independent results for two different queries', () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': true,
      '(max-width: 639px)': false,
    })

    const { result: reducedMotion } = renderHook(() => useMediaQuery('(prefers-reduced-motion: reduce)'))
    const { result: narrowViewport } = renderHook(() => useMediaQuery('(max-width: 639px)'))

    expect(reducedMotion.current).toBe(true)
    expect(narrowViewport.current).toBe(false)
  })
})
