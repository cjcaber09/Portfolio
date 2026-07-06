import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from './ThemeProvider'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders a link for every section', () => {
    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>
    )

    const expectedLinks = ['About', 'Experience', 'Skills', 'Projects', 'Education', 'Contact']
    expectedLinks.forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    })
  })

  it('renders the theme toggle button', () => {
    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>
    )
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })
})
