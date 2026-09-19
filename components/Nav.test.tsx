import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from './ThemeProvider'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders a link for every section pointing at /about', () => {
    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>
    )

    const expectedLinks = [
      { label: 'About', href: '/about#about' },
      { label: 'Experience', href: '/about#experience' },
      { label: 'Skills', href: '/about#skills' },
      { label: 'Projects', href: '/about#projects' },
      { label: 'Education', href: '/about#education' },
      { label: 'Contact', href: '/about#contact' },
    ]
    expectedLinks.forEach(({ label, href }) => {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href)
    })
  })

  it('links the brand to the home page', () => {
    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>
    )
    expect(screen.getByRole('link', { name: 'CeeDev' })).toHaveAttribute('href', '/')
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
