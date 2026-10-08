import type { ExperienceEntry, Project, StackLayer, StackTechnology } from '@/data/content'
import { entryNumber, projectAnchorId, roleAnchorId } from './sections'

export interface TraceHit {
  id: string
  number: string
  label: string
}

export interface StackTrace {
  roles: TraceHit[]
  projects: TraceHit[]
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Whole-word, case-insensitive. A neighbouring letter or digit blocks the
// match ("Express" does not find "Expressed"), but punctuation does not, so
// "React" finds "React.js" and "IBM i" finds "IBM i systems".
export function mentions(text: string, aliases: string[]): boolean {
  return aliases.some((alias) =>
    new RegExp(`(?<![A-Za-z0-9])${escapeRegExp(alias)}(?![A-Za-z0-9])`, 'i').test(text)
  )
}

function listsTechnology(project: Project, aliases: string[]): boolean {
  const wanted = aliases.map((alias) => alias.toLowerCase())
  return project.tech.some((tech) => wanted.includes(tech.toLowerCase()))
}

function roleNames(role: ExperienceEntry, aliases: string[]): boolean {
  return role.bullets.some((bullet) => mentions(bullet, aliases))
}

export function traceTechnology(
  technology: StackTechnology,
  roles: ExperienceEntry[],
  projects: Project[]
): StackTrace {
  const { aliases } = technology
  return {
    roles: roles.flatMap((role, index) =>
      roleNames(role, aliases)
        ? [{ id: roleAnchorId(role), number: entryNumber('experience', index), label: `${role.title} · ${role.company}` }]
        : []
    ),
    projects: projects.flatMap((project, index) =>
      listsTechnology(project, aliases) || mentions(project.description, aliases)
        ? [{ id: projectAnchorId(project), number: entryNumber('projects', index), label: project.title }]
        : []
    ),
  }
}

// The trace run backwards: every stack technology a role's bullets name, in
// the diagram's layer order. By construction each one traces back to this
// role, so each is drawn in the diagram.
export function roleTechnologies(role: ExperienceEntry, layers: StackLayer[]): StackTechnology[] {
  return layers
    .flatMap((layer) => layer.technologies)
    .filter((technology) => roleNames(role, technology.aliases))
}
