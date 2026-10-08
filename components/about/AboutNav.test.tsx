import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AboutNav } from './AboutNav'

function renderNav() {
  return render(
    <ThemeProvider>
      <AboutNav />
    </ThemeProvider>
  )
}

describe('AboutNav', () => {
  it('leads with a Home link to the hero, then every section, in page order', () => {
    renderNav()
    const nav = screen.getByRole('navigation', { name: 'Sections' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Home', '/about#hero'],
      ['About', '/about#about'],
      ['Experience', '/about#experience'],
      ['Skills', '/about#skills'],
      ['Projects', '/about#projects'],
      ['Education', '/about#education'],
      ['Contact', '/about#contact'],
    ])
  })

  it('marks Home as the current location before any scrolling', () => {
    renderNav()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'location')
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current')
  })

  it('links the CeeDev brand back to the animated home page', () => {
    renderNav()
    expect(screen.getByRole('link', { name: 'CeeDev' })).toHaveAttribute('href', '/')
  })

  it('carries the datasheet theme switch', () => {
    renderNav()
    expect(screen.getByRole('button', { name: 'Dark mode' })).toHaveAttribute('aria-pressed')
  })
})
