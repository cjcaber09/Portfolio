'use client'

import { useTheme } from './ThemeProvider'

// A "Dark mode" switch whose visible text is its accessible name, with
// aria-pressed carrying the state. The square marker shows the same state the
// way the block diagram's pins do: filled when on, open when off.
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      aria-pressed={isDark}
      onClick={toggleTheme}
      className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-[2px] border border-ds-rule px-2.5 text-[0.8125rem] font-semibold text-ds-ink transition-colors duration-[120ms] hover:border-ds-ink-2"
    >
      <span aria-hidden="true" className={`size-2 shrink-0 ${isDark ? 'bg-ds-accent' : 'bg-ds-cell-off'}`} />
      Dark mode
    </button>
  )
}
