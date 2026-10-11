import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from './ThemeProvider'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('is a "Dark mode" switch named by its visible text, with aria-pressed as the state', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button', { name: 'Dark mode' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button.textContent).not.toMatch(/\p{Extended_Pictographic}/u)

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('toggles the dark class on <html> and persists the choice to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button', { name: 'Dark mode' })

    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('theme')).toBe('dark')

    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem('theme')).toBe('light')
  })
})
