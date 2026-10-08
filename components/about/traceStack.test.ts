import { describe, it, expect } from 'vitest'
import { mentions, roleTechnologies, traceTechnology } from './traceStack'
import type { ExperienceEntry, Project, StackLayer } from '@/data/content'

const roles: ExperienceEntry[] = [
  {
    title: 'Web Developer / IT Specialist',
    company: 'Profound Logic',
    dates: '2022 — 2026',
    bullets: ['Modernized legacy IBM i applications using JavaScript, React.js, and modern web technologies.'],
  },
  {
    title: 'Web Developer / IT Support',
    company: 'Seahaven Business Solutions',
    dates: '2018 — 2020',
    bullets: ['Built and maintained web applications using PHP, Laravel, JavaScript, and MySQL.'],
  },
]

const projects: Project[] = [
  { title: 'Messaging App', description: 'A React + Redux Toolkit frontend.', tech: ['React', 'Express'] },
  { title: 'Task App', description: 'A tracker on Supabase Postgres.', tech: ['Vue.js', 'Supabase'] },
  { title: 'Inventory', description: 'Marketplace APIs for unified tracking.', tech: ['PHP', 'Laravel'] },
]

describe('mentions', () => {
  it('matches an alias as a whole word, case-insensitively', () => {
    expect(mentions('using JavaScript, react.js, and', ['React.js'])).toBe(true)
    expect(mentions('maintenance of internal IBM i systems', ['IBM i'])).toBe(true)
  })

  it('treats a dotted suffix as a word boundary, so "React" finds "React.js"', () => {
    expect(mentions('using React.js daily', ['React'])).toBe(true)
  })

  it('does not match inside a longer word', () => {
    expect(mentions('Expressed interest in the role', ['Express'])).toBe(false)
    expect(mentions('PostgreSQL only', ['SQL'])).toBe(false)
  })
})

describe('traceTechnology', () => {
  it('finds the roles and projects that name a technology, numbered by section and position', () => {
    const trace = traceTechnology({ name: 'React', aliases: ['React', 'React.js'] }, roles, projects)
    expect(trace.roles).toEqual([
      {
        id: 'role-profound-logic-web-developer-it-specialist',
        number: '2.1',
        label: 'Web Developer / IT Specialist · Profound Logic',
      },
    ])
    expect(trace.projects).toEqual([{ id: 'project-messaging-app', number: '4.1', label: 'Messaging App' }])
  })

  it('matches a project by its tech list as well as its description', () => {
    const trace = traceTechnology(
      { name: 'PostgreSQL', aliases: ['PostgreSQL', 'Postgres', 'Supabase'] },
      roles,
      projects
    )
    expect(trace.projects.map((hit) => hit.label)).toEqual(['Task App'])
  })

  it('keeps source order when several entries match', () => {
    const trace = traceTechnology({ name: 'PHP', aliases: ['PHP'] }, roles, projects)
    expect(trace.roles.map((hit) => hit.number)).toEqual(['2.2'])
    expect(trace.projects.map((hit) => hit.number)).toEqual(['4.3'])
  })

  it('returns empty lists for a technology nothing names', () => {
    const trace = traceTechnology({ name: 'Stripe', aliases: ['Stripe'] }, roles, projects)
    expect(trace).toEqual({ roles: [], projects: [] })
  })
})

describe('roleTechnologies', () => {
  const layers: StackLayer[] = [
    { id: 'frontend', label: 'Front end', technologies: [{ name: 'React', aliases: ['React', 'React.js'] }] },
    {
      id: 'server',
      label: 'Server',
      technologies: [
        { name: 'Laravel', aliases: ['Laravel'] },
        { name: 'PHP', aliases: ['PHP'] },
      ],
    },
    {
      id: 'data',
      label: 'Data',
      technologies: [
        { name: 'MySQL', aliases: ['MySQL'] },
        { name: 'PostgreSQL', aliases: ['PostgreSQL'] },
      ],
    },
  ]

  it("lists the technologies a role's bullets name, in layer order", () => {
    expect(roleTechnologies(roles[1], layers).map((technology) => technology.name)).toEqual([
      'Laravel',
      'PHP',
      'MySQL',
    ])
  })

  it('agrees with traceTechnology: every technology listed traces back to the role', () => {
    roleTechnologies(roles[0], layers).forEach((technology) => {
      const trace = traceTechnology(technology, roles, projects)
      expect(trace.roles.map((hit) => hit.id)).toContain('role-profound-logic-web-developer-it-specialist')
    })
  })
})
