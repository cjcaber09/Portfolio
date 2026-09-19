'use client'

import { useEffect, useState } from 'react'

function getMatches(query: string): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(query).matches
}

export function useMediaQuery(query: string): boolean {
  // Lazy initializer: this must run during the render itself, not in an
  // effect after it. usePrefersReducedMotion (the first consumer of this
  // pattern) originally used `useState(false)` plus a correcting effect,
  // which meant the very first render — before that effect ever ran —
  // could take the wrong branch in HomeIntro and throw during that render
  // under jsdom. Preserved here for every consumer, not just that first one.
  const [matches, setMatches] = useState(() => getMatches(query))

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)

    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
