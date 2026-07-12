'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Sync from whatever the anti-flash inline script (see app/layout.tsx)
  // already applied to <html> before hydration. This intentionally runs
  // post-mount (rather than as a lazy useState initializer reading
  // `document` directly) so the initial client render matches the
  // server-rendered "light" default and avoids a hydration mismatch in
  // consumers like ThemeToggle that render theme-dependent text.
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate: see comment above
    setTheme(isDark ? 'dark' : 'light')
    setMounted(true)
  }, [])

  // Persist explicit changes only after the initial sync above, so we
  // never overwrite a stored preference with the "light" default.
  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme, mounted])

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
