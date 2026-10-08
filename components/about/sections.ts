import type { ExperienceEntry, Project } from '@/data/content'

// Datasheet section numbers for /about. They carry information rather than
// decoration: the block diagram's trace readout cross-references entries by
// these numbers ("2.1", "4.3"), so every section and every entry anchor is
// numbered from this one table.
export const SECTION_NUMBER = {
  about: 1,
  experience: 2,
  skills: 3,
  projects: 4,
  education: 5,
  contact: 6,
} as const

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function roleAnchorId(role: ExperienceEntry): string {
  return `role-${slugify(role.company)}-${slugify(role.title)}`
}

export function projectAnchorId(project: Project): string {
  return `project-${slugify(project.title)}`
}

// A technology's pin in the block diagram. Links to it select that technology.
export function techAnchorId(name: string): string {
  return `tech-${slugify(name)}`
}

export function entryNumber(section: keyof typeof SECTION_NUMBER, index: number): string {
  return `${SECTION_NUMBER[section]}.${index + 1}`
}
