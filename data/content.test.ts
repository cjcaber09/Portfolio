import { describe, it, expect } from 'vitest'
import { profile, summary, experience, skills, projects, education } from './content'

describe('content data', () => {
  it('defines a complete profile', () => {
    expect(profile.name).toBe('Carl John E. Caber')
    expect(profile.title).toBe('Full-Stack Web Developer')
    expect(profile.email).toBe('cjcaber09@gmail.com')
    expect(profile.github).toContain('github.com/cjcaber09')
    expect(profile.linkedin).toContain('linkedin.com/in/carljohn09')
  })

  it('defines a non-empty summary', () => {
    expect(summary.length).toBeGreaterThan(0)
  })

  it('defines three experience entries with bullets', () => {
    expect(experience).toHaveLength(3)
    experience.forEach((entry) => {
      expect(entry.title.length).toBeGreaterThan(0)
      expect(entry.company.length).toBeGreaterThan(0)
      expect(entry.bullets.length).toBeGreaterThan(0)
    })
  })

  it('defines six skill groups', () => {
    expect(skills).toHaveLength(6)
    skills.forEach((group) => {
      expect(group.items.length).toBeGreaterThan(0)
    })
  })

  it('defines at least three placeholder projects', () => {
    expect(projects.length).toBeGreaterThanOrEqual(3)
  })

  it('defines an education entry', () => {
    expect(education.school).toBe('Southland College')
  })
})
