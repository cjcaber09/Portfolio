# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page Next.js portfolio site for Carl John E. Caber (Full-Stack Web Developer) with a light/dark theme toggle, scroll animations, and content sourced from his resume.

**Architecture:** Next.js App Router site with one route (`/`) assembled from presentational section components (`Hero`, `About`, `Experience`, `Skills`, `Projects`, `Education`, `Contact`) that all read from a single typed content module (`data/content.ts`). A client-side `ThemeProvider`/`ThemeToggle` pair drives dark mode via a `.dark` class on `<html>`, and a `Reveal` wrapper adds scroll-triggered animations via Framer Motion.

**Tech Stack:** Next.js 16.2.10 (App Router, TypeScript), React 19.2.4, Tailwind CSS v4 (CSS-first config, class-based dark mode via `@custom-variant`), Framer Motion ^12, Vitest + React Testing Library + jsdom for unit tests.

## Global Constraints

- Site is a single scrolling page at `/` — no additional routes.
- All resume-derived content lives in `data/content.ts`; components must not hardcode resume text inline.
- Projects section uses placeholder data clearly marked with a `// TODO: replace with real project details, links, and screenshots` comment above each entry — never expose "TODO" text in rendered UI copy.
- No contact form, no backend, no database, no auth, no CMS, no blog (confirmed non-goals from spec).
- Dark mode must default to system preference on first visit, then persist the user's explicit choice in `localStorage` under the key `"theme"`, with no flash of the wrong theme on load.
- Test commands in this plan use `npx vitest run <path>` (not the bare `vitest` watch mode) so they exit deterministically.
- Verified environment facts (do not assume older Next.js/Tailwind conventions from training data): `create-next-app@latest --typescript --tailwind --eslint --app --no-src-dir` scaffolds Next.js `16.2.10` + React `19.2.4`, Tailwind CSS `v4` with **no `tailwind.config.ts` file** (CSS-first config in `app/globals.css`, PostCSS via `@tailwindcss/postcss`), and `next.config.ts` (not `.js`).
- Reference: `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md` is the authoritative bundled setup guide for this Next.js version — Task 1 follows it exactly.

---

### Task 1: Scaffold Next.js project and testing infrastructure

**Files:**
- Create (via `create-next-app`): `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `package.json`, `.gitignore`, `public/`
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`
- Test: `__tests__/page.test.tsx`

**Interfaces:**
- Produces: a working `npx vitest run <path>` command any later task can use; `vitest.setup.ts` registers `@testing-library/jest-dom` matchers, `afterEach` cleanup, and `IntersectionObserver`/`matchMedia` mocks that later tasks (Reveal, ThemeToggle) depend on.

- [ ] **Step 1: Scaffold the Next.js app in the current directory**

Run from `C:\Users\Lenovo\ai-projects\portfolio` (the directory already has `.git` and `docs/` — `create-next-app` accepts this and will not touch either):

```bash
npx --yes create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack=false
```

Expected: command exits 0, prints "Success! Created ...", and `package.json`, `app/`, `public/`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` now exist in the project root.

- [ ] **Step 2: Install testing dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom vite-tsconfig-paths
```

Expected: exits 0, `devDependencies` in `package.json` now include all seven packages.

- [ ] **Step 3: Install Framer Motion (used starting Task 4)**

```bash
npm install framer-motion
```

Expected: exits 0, `dependencies` in `package.json` includes `framer-motion`.

- [ ] **Step 4: Create the Vitest config**

Create `vitest.config.mts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

- [ ] **Step 5: Create the Vitest setup file**

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jsdom does not implement IntersectionObserver; Framer Motion's
// `whileInView` (used by the Reveal component) needs this to exist.
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
})

// jsdom does not implement matchMedia; Framer Motion checks
// prefers-reduced-motion internally.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
```

- [ ] **Step 6: Add test scripts to package.json**

Modify `package.json` — replace the `"scripts"` block:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest"
  }
}
```

- [ ] **Step 7: Write a smoke test against the default scaffolded page**

Create `__tests__/page.test.tsx`:

```tsx
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
  render(<Page />)
  expect(
    screen.getByRole('heading', { level: 1, name: /To get started, edit the page.tsx file./i })
  ).toBeDefined()
})
```

- [ ] **Step 8: Run the smoke test to verify the pipeline works**

Run: `npx vitest run __tests__/page.test.tsx`
Expected: `1 passed`

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js app with Tailwind v4 and Vitest testing infra"
```

---

### Task 2: Content data module

**Files:**
- Create: `data/content.ts`
- Test: `data/content.test.ts`

**Interfaces:**
- Produces: `Profile`, `ExperienceEntry`, `SkillGroup`, `Project`, `EducationEntry` types and the values `profile: Profile`, `summary: string`, `experience: ExperienceEntry[]`, `skills: SkillGroup[]`, `projects: Project[]`, `education: EducationEntry`, all exported from `@/data/content`. Every later component task imports from here.

- [ ] **Step 1: Write the failing data-shape test**

Create `data/content.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run data/content.test.ts`
Expected: FAIL — `Cannot find module './content'` (file doesn't exist yet)

- [ ] **Step 3: Write the content module**

Create `data/content.ts`:

```ts
export interface Profile {
  name: string
  title: string
  tagline: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
}

export interface ExperienceEntry {
  title: string
  company: string
  dates: string
  bullets: string[]
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Project {
  title: string
  description: string
  tech: string[]
}

export interface EducationEntry {
  degree: string
  school: string
  dates: string
  location: string
}

export const profile: Profile = {
  name: 'Carl John E. Caber',
  title: 'Full-Stack Web Developer',
  tagline:
    'Building scalable, user-friendly web applications with 5+ years of experience across JavaScript, React, Vue, and Laravel.',
  email: 'cjcaber09@gmail.com',
  phone: '+63 977 792 6148',
  location: 'Kabankalan City, Negros Island, Philippines',
  linkedin: 'https://linkedin.com/in/carljohn09',
  github: 'https://github.com/cjcaber09',
}

export const summary =
  'Web Developer with 5+ years of experience building and maintaining scalable web applications. Skilled in JavaScript, PHP/Laravel, Node.js, Vue.js, and React.js. Experienced in API integrations, frontend UI implementation, and database management. Proficient in translating Figma and Adobe design assets into responsive web interfaces. Adept at working in Linux environments, maintaining production systems, and providing IT support. Strong problem solver with a track record of modernizing legacy systems and delivering user-friendly solutions.'

export const experience: ExperienceEntry[] = [
  {
    title: 'Web Developer / IT Specialist',
    company: 'Profound Logic',
    dates: '2022 — 2026',
    bullets: [
      'Provide IT support including technical assistance, troubleshooting, and maintenance of internal IBM i systems.',
      'Transitioned to UI development, modernizing legacy IBM i applications using JavaScript, React.js, and modern web technologies.',
      'Design and implement responsive, user-friendly web interfaces integrated with backend IBM i services.',
      'Identify and resolve bugs efficiently through a ticketing system, ensuring system stability and smooth user experience.',
    ],
  },
  {
    title: 'Freelance Web Developer',
    company: 'Self-Employed',
    dates: '2020 — 2022',
    bullets: [
      'Developed and maintained custom web applications for diverse clients using JavaScript, React.js, PHP, and Laravel.',
      'Built responsive user interfaces from Figma and Adobe design prototypes, ensuring pixel-perfect implementation.',
    ],
  },
  {
    title: 'Web Developer / IT Support',
    company: 'Seahaven Business Solutions',
    dates: '2018 — 2020',
    bullets: [
      'Contributed to development of an inventory management system with integrations for Amazon MWS, eBay API, Newegg API, Walmart API, and other marketplace platforms.',
      'Built and maintained web applications using PHP, Laravel, JavaScript, and MySQL.',
      'Developed and customized WordPress websites for clients.',
      'Provided technical support including hardware troubleshooting, software installation, and system maintenance.',
      'Assisted the IT Head in improving internal company systems and processes.',
      'Managed client websites, emails, and system maintenance as part of senior development responsibilities.',
    ],
  },
]

export const skills: SkillGroup[] = [
  { category: 'Languages', items: ['JavaScript (ES6+)', 'PHP', 'SQL'] },
  {
    category: 'Frontend',
    items: [
      'React.js',
      'Vue.js (Router, Vuex)',
      'HTML5',
      'CSS3',
      'Sass',
      'Responsive Web Design',
      'UI Implementation',
    ],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js', 'Laravel', 'CodeIgniter', 'REST API Development', 'MySQL'],
  },
  {
    category: 'Tools & Platforms',
    items: ['Git', 'Chrome DevTools', 'Linux/Bash', 'Apache Server', 'npm', 'Postman', 'Vite', 'VS Code'],
  },
  { category: 'Design', items: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator'] },
  { category: 'Other', items: ['Microsoft Office', 'WordPress'] },
]

export const projects: Project[] = [
  // TODO: replace with real project details, links, and screenshots
  {
    title: 'Legacy IBM i Modernization',
    description:
      'Modernized legacy IBM i applications by building a responsive React.js front end integrated with existing IBM i backend services, improving usability while preserving core business logic.',
    tech: ['React.js', 'JavaScript', 'IBM i'],
  },
  // TODO: replace with real project details, links, and screenshots
  {
    title: 'Multi-Marketplace Inventory Integration',
    description:
      'Contributed to an inventory management system integrating Amazon MWS, eBay, Newegg, and Walmart marketplace APIs for unified order and stock tracking.',
    tech: ['PHP', 'Laravel', 'MySQL'],
  },
  // TODO: replace with real project details, links, and screenshots
  {
    title: 'Freelance Client Web Applications',
    description:
      'Built custom, responsive web applications for freelance clients, translating Figma and Adobe design prototypes into pixel-perfect interfaces.',
    tech: ['React.js', 'PHP', 'Laravel'],
  },
]

export const education: EducationEntry = {
  degree: 'Bachelor of Science in Information Technology',
  school: 'Southland College',
  dates: '2014 — 2018',
  location: 'Kabankalan City, Negros Island, Philippines',
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run data/content.test.ts`
Expected: `6 passed`

- [ ] **Step 5: Commit**

```bash
git add data/content.ts data/content.test.ts
git commit -m "Add typed resume content data module"
```

---

### Task 3: Theme system (dark mode)

**Files:**
- Modify: `app/globals.css`
- Create: `components/ThemeProvider.tsx`
- Create: `components/ThemeToggle.tsx`
- Test: `components/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces: `ThemeProvider({ children }: { children: React.ReactNode })` (default export not used — named export) wrapping the app in `app/layout.tsx` (Task 9); `useTheme(): { theme: 'light' | 'dark', toggleTheme: () => void }` hook; `ThemeToggle()` component rendering a `<button aria-label="Toggle theme">`. Later tasks' `dark:` Tailwind classes rely on the `@custom-variant dark` rule added here.

- [ ] **Step 1: Add class-based dark mode support to globals.css**

Read the current `app/globals.css` first, then replace its entire contents with:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #ffffff;
  --foreground: #0f172a;
}

.dark {
  --background: #020617;
  --foreground: #f1f5f9;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}
```

- [ ] **Step 2: Write the failing ThemeToggle test**

Create `components/ThemeToggle.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from './ThemeProvider'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('toggles the dark class on <html> and persists the choice to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const button = screen.getByRole('button', { name: /toggle theme/i })

    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('theme')).toBe('dark')

    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem('theme')).toBe('light')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run components/ThemeToggle.test.tsx`
Expected: FAIL — `Cannot find module './ThemeProvider'` (files don't exist yet)

- [ ] **Step 4: Create ThemeProvider**

Create `components/ThemeProvider.tsx`:

```tsx
'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Sync from whatever the anti-flash inline script (see app/layout.tsx)
  // already applied to <html> before hydration.
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
    setMounted(true)
  }, [])

  // Persist explicit changes only after the initial sync above, so we
  // never overwrite a stored preference with the "light" default.
  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme, mounted])

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
```

- [ ] **Step 5: Create ThemeToggle**

Create `components/ThemeToggle.tsx`:

```tsx
'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="rounded-full border border-slate-300 p-2 text-sm transition-colors hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run components/ThemeToggle.test.tsx`
Expected: `1 passed`

- [ ] **Step 7: Commit**

```bash
git add app/globals.css components/ThemeProvider.tsx components/ThemeToggle.tsx components/ThemeToggle.test.tsx
git commit -m "Add class-based dark mode theme system"
```

---

### Task 4: Reveal animation wrapper and Nav bar

**Files:**
- Create: `components/Reveal.tsx`
- Test: `components/Reveal.test.tsx`
- Create: `components/Nav.tsx`
- Test: `components/Nav.test.tsx`

**Interfaces:**
- Consumes: `ThemeProvider`, `ThemeToggle` from Task 3.
- Produces: `Reveal({ children }: { children: React.ReactNode })` used by every section in `app/page.tsx` (Task 9); `Nav()` component used in `app/page.tsx` (Task 9).

- [ ] **Step 1: Write the failing Reveal test**

Create `components/Reveal.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'

describe('Reveal', () => {
  it('renders its children', () => {
    render(
      <Reveal>
        <p>Hello from inside Reveal</p>
      </Reveal>
    )
    expect(screen.getByText('Hello from inside Reveal')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Reveal.test.tsx`
Expected: FAIL — `Cannot find module './Reveal'`

- [ ] **Step 3: Create Reveal**

Create `components/Reveal.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Reveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Reveal.test.tsx`
Expected: `1 passed`

- [ ] **Step 5: Write the failing Nav test**

Create `components/Nav.test.tsx`:

```tsx
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
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run components/Nav.test.tsx`
Expected: FAIL — `Cannot find module './Nav'`

- [ ] **Step 7: Create Nav**

Create `components/Nav.tsx`:

```tsx
import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#hero" className="font-semibold">
          Carl John Caber
        </a>
        <ul className="hidden gap-6 text-sm sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-sky-600 dark:hover:text-sky-400">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run components/Nav.test.tsx`
Expected: `2 passed`

- [ ] **Step 9: Commit**

```bash
git add components/Reveal.tsx components/Reveal.test.tsx components/Nav.tsx components/Nav.test.tsx
git commit -m "Add scroll-reveal wrapper and nav bar"
```

---

### Task 5: Hero and About sections

**Files:**
- Create: `components/Hero.tsx`
- Test: `components/Hero.test.tsx`
- Create: `components/About.tsx`
- Test: `components/About.test.tsx`

**Interfaces:**
- Consumes: `profile`, `summary` from `@/data/content` (Task 2).
- Produces: `Hero()` and `About()` components used in `app/page.tsx` (Task 9). Both render `<section id="...">` landmarks (`#hero`, `#about`) that `Nav`'s anchors (Task 4) target.

- [ ] **Step 1: Write the failing Hero test**

Create `components/Hero.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { profile } from '@/data/content'

describe('Hero', () => {
  it('renders the profile name, title, and tagline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument()
    expect(screen.getByText(profile.title)).toBeInTheDocument()
    expect(screen.getByText(profile.tagline)).toBeInTheDocument()
  })

  it('links the resume download button to /resume.pdf', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /download resume/i })).toHaveAttribute(
      'href',
      '/resume.pdf'
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Hero.test.tsx`
Expected: FAIL — `Cannot find module './Hero'`

- [ ] **Step 3: Create Hero**

Create `components/Hero.tsx`:

```tsx
import { profile } from '@/data/content'

export function Hero() {
  return (
    <section id="hero" className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-24">
      <p className="text-sky-600 dark:text-sky-400">Hi, I&apos;m</p>
      <h1 className="text-4xl font-bold sm:text-5xl">{profile.name}</h1>
      <h2 className="text-xl text-slate-600 dark:text-slate-300">{profile.title}</h2>
      <p className="max-w-2xl text-slate-600 dark:text-slate-300">{profile.tagline}</p>
      <div className="flex flex-wrap gap-4">
        <a
          href="#projects"
          className="rounded-md bg-sky-600 px-5 py-3 text-white transition-colors hover:bg-sky-700"
        >
          View Projects
        </a>
        <a
          href="/resume.pdf"
          download
          className="rounded-md border border-slate-300 px-5 py-3 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Download Resume
        </a>
        <a
          href="#contact"
          className="rounded-md border border-slate-300 px-5 py-3 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Contact
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Hero.test.tsx`
Expected: `2 passed`

- [ ] **Step 5: Write the failing About test**

Create `components/About.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'
import { summary } from '@/data/content'

describe('About', () => {
  it('renders the professional summary', () => {
    render(<About />)
    expect(screen.getByText(summary)).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run components/About.test.tsx`
Expected: FAIL — `Cannot find module './About'`

- [ ] **Step 7: Create About**

Create `components/About.tsx`:

```tsx
import { summary } from '@/data/content'

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-6 text-3xl font-bold">About</h2>
      <p className="max-w-3xl text-slate-600 dark:text-slate-300">{summary}</p>
    </section>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run components/About.test.tsx`
Expected: `1 passed`

- [ ] **Step 9: Commit**

```bash
git add components/Hero.tsx components/Hero.test.tsx components/About.tsx components/About.test.tsx
git commit -m "Add Hero and About sections"
```

---

### Task 6: Experience and Education sections

**Files:**
- Create: `components/Experience.tsx`
- Test: `components/Experience.test.tsx`
- Create: `components/Education.tsx`
- Test: `components/Education.test.tsx`

**Interfaces:**
- Consumes: `experience: ExperienceEntry[]`, `education: EducationEntry` from `@/data/content` (Task 2).
- Produces: `Experience()` and `Education()` components used in `app/page.tsx` (Task 9), rendering `<section id="experience">` and `<section id="education">`.

- [ ] **Step 1: Write the failing Experience test**

Create `components/Experience.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Experience } from './Experience'
import { experience } from '@/data/content'

describe('Experience', () => {
  it('renders every role, company, and first bullet', () => {
    render(<Experience />)
    experience.forEach((role) => {
      expect(screen.getByText(new RegExp(role.title))).toBeInTheDocument()
      expect(screen.getByText(new RegExp(role.company))).toBeInTheDocument()
      expect(screen.getByText(role.bullets[0])).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Experience.test.tsx`
Expected: FAIL — `Cannot find module './Experience'`

- [ ] **Step 3: Create Experience**

Create `components/Experience.tsx`:

```tsx
import { experience } from '@/data/content'

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-10 text-3xl font-bold">Experience</h2>
      <ol className="space-y-10 border-l border-slate-200 pl-6 dark:border-slate-800">
        {experience.map((role) => (
          <li key={`${role.company}-${role.title}`}>
            <p className="text-sm text-sky-600 dark:text-sky-400">{role.dates}</p>
            <h3 className="text-lg font-semibold">
              {role.title} · {role.company}
            </h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Experience.test.tsx`
Expected: `1 passed`

- [ ] **Step 5: Write the failing Education test**

Create `components/Education.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Education } from './Education'
import { education } from '@/data/content'

describe('Education', () => {
  it('renders the degree, school, dates, and location', () => {
    render(<Education />)
    expect(screen.getByText(education.degree)).toBeInTheDocument()
    expect(screen.getByText(education.school)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(education.dates))).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run components/Education.test.tsx`
Expected: FAIL — `Cannot find module './Education'`

- [ ] **Step 7: Create Education**

Create `components/Education.tsx`:

```tsx
import { education } from '@/data/content'

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-6 text-3xl font-bold">Education</h2>
      <p className="text-lg font-semibold">{education.degree}</p>
      <p className="text-slate-600 dark:text-slate-300">{education.school}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {education.dates} · {education.location}
      </p>
    </section>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run components/Education.test.tsx`
Expected: `1 passed`

- [ ] **Step 9: Commit**

```bash
git add components/Experience.tsx components/Experience.test.tsx components/Education.tsx components/Education.test.tsx
git commit -m "Add Experience and Education sections"
```

---

### Task 7: Skills and Contact sections

**Files:**
- Create: `components/Skills.tsx`
- Test: `components/Skills.test.tsx`
- Create: `components/Contact.tsx`
- Test: `components/Contact.test.tsx`

**Interfaces:**
- Consumes: `skills: SkillGroup[]`, `profile: Profile` from `@/data/content` (Task 2).
- Produces: `Skills()` and `Contact()` components used in `app/page.tsx` (Task 9), rendering `<section id="skills">` and `<section id="contact">`.

- [ ] **Step 1: Write the failing Skills test**

Create `components/Skills.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skills } from './Skills'
import { skills } from '@/data/content'

describe('Skills', () => {
  it('renders every category and its items', () => {
    render(<Skills />)
    skills.forEach((group) => {
      expect(screen.getByText(group.category)).toBeInTheDocument()
      group.items.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument()
      })
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Skills.test.tsx`
Expected: FAIL — `Cannot find module './Skills'`

- [ ] **Step 3: Create Skills**

Create `components/Skills.tsx`:

```tsx
import { skills } from '@/data/content'

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-10 text-3xl font-bold">Skills</h2>
      <div className="grid gap-8 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Skills.test.tsx`
Expected: `1 passed`

- [ ] **Step 5: Write the failing Contact test**

Create `components/Contact.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'
import { profile } from '@/data/content'

describe('Contact', () => {
  it('renders mailto, tel, LinkedIn, and GitHub links', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`
    )
    expect(screen.getByRole('link', { name: profile.phone })).toHaveAttribute(
      'href',
      'tel:+639777926148'
    )
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      profile.linkedin
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', profile.github)
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run components/Contact.test.tsx`
Expected: FAIL — `Cannot find module './Contact'`

- [ ] **Step 7: Create Contact**

Create `components/Contact.tsx`:

```tsx
import { profile } from '@/data/content'

export function Contact() {
  const telHref = `tel:${profile.phone.replace(/\s+/g, '')}`

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <h2 className="mb-6 text-3xl font-bold">Contact</h2>
      <p className="mb-6 max-w-2xl text-slate-600 dark:text-slate-300">
        Feel free to reach out — I&apos;m open to new opportunities and collaborations.
      </p>
      <ul className="flex flex-wrap gap-6 text-sm">
        <li>
          <a href={`mailto:${profile.email}`} className="hover:text-sky-600 dark:hover:text-sky-400">
            {profile.email}
          </a>
        </li>
        <li>
          <a href={telHref} className="hover:text-sky-600 dark:hover:text-sky-400">
            {profile.phone}
          </a>
        </li>
        <li>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-600 dark:hover:text-sky-400"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-600 dark:hover:text-sky-400"
          >
            GitHub
          </a>
        </li>
      </ul>
    </section>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run components/Contact.test.tsx`
Expected: `1 passed`

- [ ] **Step 9: Commit**

```bash
git add components/Skills.tsx components/Skills.test.tsx components/Contact.tsx components/Contact.test.tsx
git commit -m "Add Skills and Contact sections"
```

---

### Task 8: Projects section

**Files:**
- Create: `components/Projects.tsx`
- Test: `components/Projects.test.tsx`

**Interfaces:**
- Consumes: `projects: Project[]` from `@/data/content` (Task 2).
- Produces: `Projects()` component used in `app/page.tsx` (Task 9), rendering `<section id="projects">`.

- [ ] **Step 1: Write the failing Projects test**

Create `components/Projects.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Projects } from './Projects'
import { projects } from '@/data/content'

describe('Projects', () => {
  it('renders every project title, description, and tech tag', () => {
    render(<Projects />)
    projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument()
      expect(screen.getByText(project.description)).toBeInTheDocument()
      project.tech.forEach((tech) => {
        expect(screen.getAllByText(tech).length).toBeGreaterThan(0)
      })
    })
  })

  it('never renders literal TODO text', () => {
    render(<Projects />)
    expect(screen.queryByText(/TODO/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Projects.test.tsx`
Expected: FAIL — `Cannot find module './Projects'`

- [ ] **Step 3: Create Projects**

Create `components/Projects.tsx`:

```tsx
import { projects } from '@/data/content'

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-10 text-3xl font-bold">Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.title}
            className="rounded-lg border border-slate-200 p-6 dark:border-slate-800"
          >
            <h3 className="mb-2 font-semibold">{project.title}</h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-sky-50 px-2 py-1 text-xs text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Projects.test.tsx`
Expected: `2 passed`

- [ ] **Step 5: Commit**

```bash
git add components/Projects.tsx components/Projects.test.tsx
git commit -m "Add Projects section with placeholder cards"
```

---

### Task 9: Root layout, page assembly, and anti-flash theme script

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `__tests__/page.test.tsx`

**Interfaces:**
- Consumes: `ThemeProvider` (Task 3), `Nav` (Task 4), `Reveal` (Task 4), `Hero`/`About` (Task 5), `Experience`/`Education` (Task 6), `Skills`/`Contact` (Task 7), `Projects` (Task 8).
- Produces: the assembled `/` route.

- [ ] **Step 1: Replace app/layout.tsx**

Read the current `app/layout.tsx` first (it has the scaffolded Geist font setup), then replace its entire contents with:

```tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Carl John E. Caber — Full-Stack Web Developer',
  description:
    'Portfolio of Carl John E. Caber, a Full-Stack Web Developer specializing in React, Vue, Node.js, and Laravel.',
}

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Replace app/page.tsx**

```tsx
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Experience } from '@/components/Experience'
import { Skills } from '@/components/Skills'
import { Projects } from '@/components/Projects'
import { Education } from '@/components/Education'
import { Contact } from '@/components/Contact'
import { Reveal } from '@/components/Reveal'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Experience />
        </Reveal>
        <Reveal>
          <Skills />
        </Reveal>
        <Reveal>
          <Projects />
        </Reveal>
        <Reveal>
          <Education />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
    </>
  )
}
```

- [ ] **Step 3: Replace the page smoke test with a real integration test**

Replace `__tests__/page.test.tsx` entirely with:

```tsx
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'
import { ThemeProvider } from '@/components/ThemeProvider'
import { profile } from '@/data/content'

test('Home page renders all sections', () => {
  render(
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  )
  expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument()
  ;['About', 'Experience', 'Skills', 'Projects', 'Education', 'Contact'].forEach((label) => {
    expect(screen.getByRole('heading', { level: 2, name: label })).toBeInTheDocument()
  })
})
```

Note: `Page` itself doesn't include `ThemeProvider` — that's applied by `app/layout.tsx` in the real app. The test wraps it manually since RTL renders `page.tsx` in isolation from the layout tree.

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: all test files pass (12 files: `data/content.test.ts`, `components/ThemeToggle.test.tsx`, `components/Reveal.test.tsx`, `components/Nav.test.tsx`, `components/Hero.test.tsx`, `components/About.test.tsx`, `components/Experience.test.tsx`, `components/Education.test.tsx`, `components/Skills.test.tsx`, `components/Contact.test.tsx`, `components/Projects.test.tsx`, `__tests__/page.test.tsx`)

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx __tests__/page.test.tsx
git commit -m "Assemble portfolio page with anti-flash theme script"
```

---

### Task 10: Resume asset, production build, and README

**Files:**
- Create: `public/resume.pdf`
- Modify: `README.md`

**Interfaces:**
- Consumes: the Hero component's existing `href="/resume.pdf"` link (Task 5) — this task only needs to place the file, not change any code.

- [ ] **Step 1: Convert the source resume to PDF and place it in public/**

The source resume lives at `C:\Users\Lenovo\Downloads\resume.docx`. Convert it to PDF using LibreOffice headless (invoke via the `anthropic-skills:docx` skill's bundled `scripts/office/soffice.py`, or any available `soffice`/`libreoffice` binary), then copy the result to `public/resume.pdf`:

```bash
python "<docx-skill-dir>/scripts/office/soffice.py" --headless --convert-to pdf --outdir /tmp "C:\Users\Lenovo\Downloads\resume.docx"
cp /tmp/resume.pdf public/resume.pdf
```

Expected: `public/resume.pdf` exists and is non-empty (`ls -la public/resume.pdf` shows a file size > 0).

- [ ] **Step 2: Verify the download link resolves in the built app**

Run the production build (this also validates Step 1 didn't break anything and exercises all pages/components through the real Next.js compiler, not just Vitest):

```bash
npm run build
```

Expected: exits 0, ends with a route summary showing `/` as a static route.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: exits 0 with no errors (warnings acceptable).

- [ ] **Step 4: Run the full test suite one more time**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 5: Update README.md**

Read the current `README.md` (create-next-app's default boilerplate), then replace its entire contents with:

```md
# Carl John E. Caber — Portfolio

Personal portfolio site built with Next.js, Tailwind CSS v4, and Framer Motion.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npx vitest run
```

## Content

All resume-derived content (profile, summary, experience, skills, education,
contact links) lives in `data/content.ts`. Edit that file to update site copy
without touching component code.

The `projects` array in `data/content.ts` currently holds placeholder entries
inferred from work history (marked with `// TODO` comments in the source).
Replace them with real project titles, descriptions, tech stacks, and links
when available.

## Deployment

Deploy to [Vercel](https://vercel.com/new) by importing this repository —
no additional configuration required.
```

- [ ] **Step 6: Commit**

```bash
git add public/resume.pdf README.md
git commit -m "Add resume PDF asset and project README"
```

---

## Post-Plan Follow-Up (not part of this plan's scope)

Once the user has real project details, they should replace the placeholder
entries in the `projects` array of `data/content.ts` (see the `// TODO`
comments) with actual titles, descriptions, tech stacks, and links —
optionally adding a `link?: string` field to the `Project` interface at that
time.
