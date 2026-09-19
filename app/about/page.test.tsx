import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage from './page'
import { ThemeProvider } from '@/components/ThemeProvider'
import { profile } from '@/data/content'

test('About page renders all sections', () => {
  render(
    <ThemeProvider>
      <AboutPage />
    </ThemeProvider>
  )
  expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument()
  ;['About', 'Experience', 'Skills', 'Projects', 'Education', 'Contact'].forEach((label) => {
    expect(screen.getByRole('heading', { level: 2, name: label })).toBeInTheDocument()
  })
})
