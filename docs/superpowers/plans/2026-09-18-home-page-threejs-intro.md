# Home Page Three.js Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new animated Home page at `/` with a Three.js particle-cloud "CeeDev" scroll intro, and move the existing one-page portfolio (Hero through Contact) to `/about`.

**Architecture:** `app/page.tsx` becomes a thin Server Component that renders `Nav` plus a client-only-loaded `HomeIntro` (Three.js particle text + scroll-timed one-liners + CTA, built on `@react-three/fiber`/`@react-three/drei`). The former `app/page.tsx` content moves unchanged to `app/about/page.tsx`. `Nav`'s section links become `/about#section` so they work from either page.

**Tech Stack:** Next.js 16.2.10 (App Router), React 19.2.4, `@react-three/fiber` ^9.7.0, `@react-three/drei` ^10.7.8, `three` ^0.186.0, Framer Motion ^12 (unchanged usage elsewhere), Tailwind CSS v4, Vitest + React Testing Library.

## Global Constraints

- `/about` must render byte-for-byte the same Hero-through-Contact experience that currently lives at `/` — no content or behavior changes during the move.
- `Nav` renders on both `/` and `/about`; its section links point to `/about#about`, `/about#experience`, `/about#skills`, `/about#projects`, `/about#education`, `/about#contact`; its brand link ("CeeDev") points to `/`.
- Home page one-liners, in order: "Full-Stack Web Developer.", "Building scalable web experiences.", "From legacy IBM i to modern React."
- CTA button label: "View My Work", linking to `/about`.
- Scroll track is short: `ScrollControls pages={4}` (~4 viewport-heights).
- `prefers-reduced-motion: reduce` must skip all scroll-scrub/particle motion and render one static screen (formed "CeeDev" text, all three one-liners, the CTA) with nothing gated behind scroll position.
- The Home page's Canvas/Three.js content must never be server-rendered — load it via `next/dynamic(..., { ssr: false })` from inside a Client Component (per `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`: "`ssr: false` is not allowed with `next/dynamic` in Server Components").
- Verified dependency versions (checked against the npm registry for this exact environment, not assumed from training data): `@react-three/fiber@9.7.0` (peer: `react >=19 <19.3`, `three >=0.156`), `@react-three/drei@10.7.8` (peer: `react ^19`, `three >=0.159`, `@react-three/fiber ^9.0.0`), `three@0.186.0`, `@types/three@0.186.0`. All compatible with this project's React 19.2.4.
- Canvas/WebGL rendering cannot be exercised under Vitest+jsdom (no WebGL context available). Per this project's own established pattern (see `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`'s note on async Server Components needing E2E instead of unit tests), any code that requires a real `<canvas>` WebGL context or real browser Canvas 2D rasterization is not unit-tested — it is isolated into small, clearly-labeled files and verified by running the dev server and visually confirming behavior. Everything else (data, pure math, the reduced-motion UI branch, routing, Nav) is unit-tested as normal.
- **Deviation from the design spec, noted here for traceability:** the spec described the one-liner/CTA overlay fades as "Framer Motion opacity cross-fades keyed to `useScroll().offset`". That exact mechanism doesn't work: drei's `useScroll().offset` is a plain number recomputed every frame inside R3F's render loop, not a Framer Motion `MotionValue`, so it can't drive `useTransform` directly. Task 3/5 instead use a pure `fadeOpacity(offset, from, to, edge)` function plus an imperative `ref.style.opacity` update inside `useFrame`. The user-visible intent (HTML-overlaid text that cross-fades in/out over its own scroll range) is unchanged — only the animation-library mechanism differs from the spec's wording.

---

### Task 1: Move portfolio to `/about`; update Nav links

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/about/page.test.tsx`
- Modify: `components/Nav.tsx`
- Modify: `components/Nav.test.tsx`

**Interfaces:**
- Produces: the `/about` route rendering the existing Hero/About/Experience/Skills/Projects/Education/Contact experience; `Nav`'s links now point at `/about#section` and `/`. Later tasks (Task 6) rely on `Nav` being unchanged in every other respect.

- [ ] **Step 1: Create the About page**

Create `app/about/page.tsx` with the exact content currently in `app/page.tsx`, renamed to `AboutPage`:

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

export default function AboutPage() {
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

- [ ] **Step 2: Write the About page test**

Create `app/about/page.test.tsx`:

```tsx
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
```

- [ ] **Step 3: Run the About page test**

Run: `npx vitest run app/about/page.test.tsx`
Expected: `1 passed`

- [ ] **Step 4: Write the failing Nav href test**

Replace the full contents of `components/Nav.test.tsx`:

```tsx
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
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npx vitest run components/Nav.test.tsx`
Expected: FAIL — hrefs are still `#about` etc., not `/about#about`

- [ ] **Step 6: Update Nav's links**

Modify `components/Nav.tsx` — replace the `links` array and the brand `<a>`'s `href`:

```tsx
import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '/about#about', label: 'About' },
  { href: '/about#experience', label: 'Experience' },
  { href: '/about#skills', label: 'Skills' },
  { href: '/about#projects', label: 'Projects' },
  { href: '/about#education', label: 'Education' },
  { href: '/about#contact', label: 'Contact' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="/" className="font-semibold">
          CeeDev
        </a>
        <ul className="hidden gap-6 text-sm sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-emerald-700 dark:hover:text-emerald-400">
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

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run components/Nav.test.tsx`
Expected: `3 passed`

- [ ] **Step 8: Run the full suite to confirm nothing else broke**

Run: `npx vitest run`
Expected: all tests pass (the pre-existing `__tests__/page.test.tsx` still renders the old `app/page.tsx`, which is untouched by this task, so it still passes too)

- [ ] **Step 9: Commit**

```bash
git add app/about/page.tsx app/about/page.test.tsx components/Nav.tsx components/Nav.test.tsx
git commit -m "Move portfolio content to /about; point Nav at the new route"
```

---

### Task 2: Home page one-liner content

**Files:**
- Modify: `data/content.ts`
- Modify: `data/content.test.ts`

**Interfaces:**
- Produces: `homeOneLiners: string[]` exported from `@/data/content`, exactly 3 entries. Task 5 imports this.

- [ ] **Step 1: Write the failing test**

Add to `data/content.test.ts` (inside the existing `describe('content data', ...)` block, as a new `it`):

```ts
  it('defines three home page one-liners', () => {
    expect(homeOneLiners).toEqual([
      'Full-Stack Web Developer.',
      'Building scalable web experiences.',
      'From legacy IBM i to modern React.',
    ])
  })
```

Update the import at the top of `data/content.test.ts` to include `homeOneLiners`:

```ts
import { profile, summary, experience, skills, projects, education, homeOneLiners } from './content'
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run data/content.test.ts`
Expected: FAIL — `homeOneLiners` is not exported

- [ ] **Step 3: Add the export**

Add to `data/content.ts`, after the `education` export:

```ts
export const homeOneLiners: string[] = [
  'Full-Stack Web Developer.',
  'Building scalable web experiences.',
  'From legacy IBM i to modern React.',
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run data/content.test.ts`
Expected: `7 passed`

- [ ] **Step 5: Commit**

```bash
git add data/content.ts data/content.test.ts
git commit -m "Add Home page one-liner content"
```

---

### Task 3: Scroll animation math (particle positions + fade opacity)

**Files:**
- Create: `components/home/particlePositions.ts`
- Create: `components/home/particlePositions.test.ts`
- Create: `components/home/fadeOpacity.ts`
- Create: `components/home/fadeOpacity.test.ts`

**Interfaces:**
- Produces:
  - `sampleTextPoints(imageData: { data: Uint8ClampedArray; width: number; height: number }, step: number, alphaThreshold: number): { x: number; y: number }[]`
  - `createScatteredParticles(targets: { x: number; y: number }[], options: { centerX: number; centerY: number; depth: number; scatterRadius: number; random?: () => number }): ScatteredParticle[]`, where `ScatteredParticle = { target: { x: number; y: number; z: number }; start: { x: number; y: number; z: number } }`
  - `interpolateParticle(particle: ScatteredParticle, progress: number): { x: number; y: number; z: number }`
  - `fadeOpacity(offset: number, from: number, to: number, edge: number): number`
- Task 4 consumes `sampleTextPoints`, `createScatteredParticles`, `interpolateParticle`. Task 5 consumes `fadeOpacity`.

- [ ] **Step 1: Write the failing particle-position tests**

Create `components/home/particlePositions.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { sampleTextPoints, createScatteredParticles, interpolateParticle } from './particlePositions'

function makeImageData(width: number, height: number, litPixels: Array<[number, number]>) {
  const data = new Uint8ClampedArray(width * height * 4)
  for (const [x, y] of litPixels) {
    const i = (y * width + x) * 4
    data[i] = 255
    data[i + 1] = 255
    data[i + 2] = 255
    data[i + 3] = 255
  }
  return { data, width, height }
}

describe('sampleTextPoints', () => {
  it('returns only points above the alpha threshold, in row-major order', () => {
    const imageData = makeImageData(4, 4, [
      [1, 1],
      [2, 2],
    ])
    const points = sampleTextPoints(imageData, 1, 128)
    expect(points).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ])
  })

  it('respects the step size', () => {
    const imageData = makeImageData(4, 4, [
      [0, 0],
      [1, 0],
      [2, 0],
    ])
    const points = sampleTextPoints(imageData, 2, 128)
    expect(points).toEqual([{ x: 0, y: 0 }, { x: 2, y: 0 }])
  })

  it('returns an empty array when nothing clears the threshold', () => {
    const imageData = makeImageData(4, 4, [])
    expect(sampleTextPoints(imageData, 1, 128)).toEqual([])
  })
})

describe('createScatteredParticles', () => {
  it('produces one particle per target, centered and depth-jittered, with a scattered start', () => {
    const targets = [{ x: 10, y: 20 }]
    let call = 0
    const random = () => {
      // Deterministic sequence: depth jitter, then 3 for the scattered start (x, y, z)
      const sequence = [0.5, 0.25, 0.75, 0.5]
      return sequence[call++ % sequence.length]
    }

    const particles = createScatteredParticles(targets, {
      centerX: 5,
      centerY: 5,
      depth: 2,
      scatterRadius: 10,
      random,
    })

    expect(particles).toHaveLength(1)
    // target: x - centerX, y flipped (centerY - y) so up is positive, z from depth jitter
    expect(particles[0].target.x).toBe(5)
    expect(particles[0].target.y).toBe(-15)
    expect(particles[0].target.z).toBeCloseTo(0, 5) // (0.5 - 0.5) * depth = 0
    // start: each axis is (random() * 2 - 1) * scatterRadius
    expect(particles[0].start.x).toBeCloseTo((0.25 * 2 - 1) * 10, 5)
    expect(particles[0].start.y).toBeCloseTo((0.75 * 2 - 1) * 10, 5)
    expect(particles[0].start.z).toBeCloseTo((0.5 * 2 - 1) * 10, 5)
  })
})

describe('interpolateParticle', () => {
  const particle = {
    start: { x: 0, y: 0, z: 0 },
    target: { x: 10, y: -20, z: 4 },
  }

  it('is at the start position when progress is 0', () => {
    expect(interpolateParticle(particle, 0)).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('is at the target position when progress is 1', () => {
    expect(interpolateParticle(particle, 1)).toEqual({ x: 10, y: -20, z: 4 })
  })

  it('is at the midpoint when progress is 0.5', () => {
    expect(interpolateParticle(particle, 0.5)).toEqual({ x: 5, y: -10, z: 2 })
  })

  it('clamps progress outside [0, 1]', () => {
    expect(interpolateParticle(particle, -1)).toEqual({ x: 0, y: 0, z: 0 })
    expect(interpolateParticle(particle, 2)).toEqual({ x: 10, y: -20, z: 4 })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/home/particlePositions.test.ts`
Expected: FAIL — `Cannot find module './particlePositions'`

- [ ] **Step 3: Implement particlePositions.ts**

Create `components/home/particlePositions.ts`:

```ts
export interface Point2D {
  x: number
  y: number
}

export interface Point3D {
  x: number
  y: number
  z: number
}

export interface ScatteredParticle {
  target: Point3D
  start: Point3D
}

export function sampleTextPoints(
  imageData: { data: Uint8ClampedArray; width: number; height: number },
  step: number,
  alphaThreshold: number
): Point2D[] {
  const points: Point2D[] = []
  for (let y = 0; y < imageData.height; y += step) {
    for (let x = 0; x < imageData.width; x += step) {
      const alpha = imageData.data[(y * imageData.width + x) * 4 + 3]
      if (alpha > alphaThreshold) {
        points.push({ x, y })
      }
    }
  }
  return points
}

export function createScatteredParticles(
  targets: Point2D[],
  options: {
    centerX: number
    centerY: number
    depth: number
    scatterRadius: number
    random?: () => number
  }
): ScatteredParticle[] {
  const random = options.random ?? Math.random
  return targets.map((point) => ({
    target: {
      x: point.x - options.centerX,
      y: options.centerY - point.y,
      z: (random() - 0.5) * options.depth,
    },
    start: {
      x: (random() * 2 - 1) * options.scatterRadius,
      y: (random() * 2 - 1) * options.scatterRadius,
      z: (random() * 2 - 1) * options.scatterRadius,
    },
  }))
}

export function interpolateParticle(particle: ScatteredParticle, progress: number): Point3D {
  const t = Math.min(Math.max(progress, 0), 1)
  return {
    x: particle.start.x + (particle.target.x - particle.start.x) * t,
    y: particle.start.y + (particle.target.y - particle.start.y) * t,
    z: particle.start.z + (particle.target.z - particle.start.z) * t,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/home/particlePositions.test.ts`
Expected: `8 passed`

- [ ] **Step 5: Write the failing fadeOpacity test**

Create `components/home/fadeOpacity.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { fadeOpacity } from './fadeOpacity'

describe('fadeOpacity', () => {
  it('is 0 before the range starts', () => {
    expect(fadeOpacity(0.1, 0.4, 0.6, 0.05)).toBe(0)
  })

  it('is 0 after the range ends', () => {
    expect(fadeOpacity(0.7, 0.4, 0.6, 0.05)).toBe(0)
  })

  it('is 1 in the plateau between the fade-in and fade-out edges', () => {
    expect(fadeOpacity(0.5, 0.4, 0.6, 0.05)).toBe(1)
  })

  it('fades in linearly across the leading edge', () => {
    expect(fadeOpacity(0.4, 0.4, 0.6, 0.05)).toBe(0)
    expect(fadeOpacity(0.425, 0.4, 0.6, 0.05)).toBeCloseTo(0.5, 5)
    expect(fadeOpacity(0.45, 0.4, 0.6, 0.05)).toBe(1)
  })

  it('fades out linearly across the trailing edge', () => {
    // NOTE: 0.6 - 0.05 is not exactly 0.55 in IEEE 754 floating point, so this
    // boundary uses toBeCloseTo rather than toBe.
    expect(fadeOpacity(0.55, 0.4, 0.6, 0.05)).toBeCloseTo(1, 10)
    expect(fadeOpacity(0.575, 0.4, 0.6, 0.05)).toBeCloseTo(0.5, 5)
    expect(fadeOpacity(0.6, 0.4, 0.6, 0.05)).toBe(0)
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run components/home/fadeOpacity.test.ts`
Expected: FAIL — `Cannot find module './fadeOpacity'`

- [ ] **Step 7: Implement fadeOpacity.ts**

Create `components/home/fadeOpacity.ts`:

```ts
export function fadeOpacity(offset: number, from: number, to: number, edge: number): number {
  if (offset <= from || offset >= to) return 0
  const fadeInEnd = from + edge
  const fadeOutStart = to - edge
  if (offset < fadeInEnd) return (offset - from) / edge
  if (offset > fadeOutStart) return (to - offset) / edge
  return 1
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run components/home/fadeOpacity.test.ts`
Expected: `5 passed`

- [ ] **Step 9: Commit**

```bash
git add components/home/particlePositions.ts components/home/particlePositions.test.ts components/home/fadeOpacity.ts components/home/fadeOpacity.test.ts
git commit -m "Add pure scroll animation math: particle positions and fade opacity"
```

---

### Task 4: Particle text (Three.js / React Three Fiber)

**Files:**
- Modify: `package.json` (new dependencies)
- Create: `components/home/rasterizeText.ts`
- Create: `components/home/ParticleText.tsx`

**Interfaces:**
- Consumes: `sampleTextPoints`, `createScatteredParticles`, `interpolateParticle` from `./particlePositions` (Task 3).
- Produces: `ParticleText()` — a Client Component that must be rendered as a child of `@react-three/drei`'s `<ScrollControls>` inside an `@react-three/fiber` `<Canvas>`. Task 5 consumes this.
- **Not unit-tested** — `rasterizeText` requires a real browser `<canvas>` 2D context, and `ParticleText` requires a real WebGL context, neither of which exist under Vitest+jsdom. Verify by running the dev server (Task 6's final step) and visually confirming the particle text renders and responds to scroll.

- [ ] **Step 1: Install dependencies**

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

Expected: exits 0. `package.json` `dependencies` now include `three`, `@react-three/fiber`, `@react-three/drei`; `devDependencies` include `@types/three`.

- [ ] **Step 2: Create the text rasterizer**

Create `components/home/rasterizeText.ts`:

```ts
export interface RasterizedText {
  data: Uint8ClampedArray
  width: number
  height: number
}

export function rasterizeText(
  text: string,
  options: { width: number; height: number; fontSize: number; fontFamily: string }
): RasterizedText {
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('2D canvas context is not available')
  }
  ctx.fillStyle = '#fff'
  ctx.font = `700 ${options.fontSize}px ${options.fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, options.width / 2, options.height / 2)
  const imageData = ctx.getImageData(0, 0, options.width, options.height)
  return { data: imageData.data, width: imageData.width, height: imageData.height }
}
```

- [ ] **Step 3: Create ParticleText**

Create `components/home/ParticleText.tsx`:

```tsx
'use client'

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { rasterizeText } from './rasterizeText'
import { sampleTextPoints, createScatteredParticles, interpolateParticle } from './particlePositions'

const TEXT = 'CeeDev'
const RASTER_WIDTH = 480
const RASTER_HEIGHT = 160
const SAMPLE_STEP = 3
const ALPHA_THRESHOLD = 128
const SCATTER_RADIUS = 6
const DEPTH_JITTER = 1.2
const WORLD_SCALE = 0.02
const GATHER_END_OFFSET = 0.4

export function ParticleText() {
  const scroll = useScroll()

  const particles = useMemo(() => {
    const imageData = rasterizeText(TEXT, {
      width: RASTER_WIDTH,
      height: RASTER_HEIGHT,
      fontSize: 96,
      fontFamily: 'system-ui, sans-serif',
    })
    const points = sampleTextPoints(imageData, SAMPLE_STEP, ALPHA_THRESHOLD)
    return createScatteredParticles(points, {
      centerX: RASTER_WIDTH / 2,
      centerY: RASTER_HEIGHT / 2,
      depth: DEPTH_JITTER,
      scatterRadius: SCATTER_RADIUS,
    })
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(particles.length * 3), 3)
    )
    return geo
  }, [particles])

  useFrame(() => {
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const progress = THREE.MathUtils.clamp(scroll.offset / GATHER_END_OFFSET, 0, 1)
    for (let i = 0; i < particles.length; i++) {
      const p = interpolateParticle(particles[i], progress)
      positionAttr.setXYZ(i, p.x * WORLD_SCALE, p.y * WORLD_SCALE, p.z * WORLD_SCALE)
    }
    positionAttr.needsUpdate = true
  })

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#34d399" size={0.04} sizeAttenuation transparent opacity={0.9} />
    </points>
  )
}
```

- [ ] **Step 4: Run the full test suite to confirm nothing broke**

Run: `npx vitest run`
Expected: all previously-passing tests still pass (this task adds no new tests, per the Global Constraints note on Canvas/WebGL code)

- [ ] **Step 5: Run the type checker**

Run: `npx tsc --noEmit`
Expected: no errors. If `@react-three/fiber`'s JSX intrinsics (`<points>`, `<pointsMaterial>`) aren't recognized, consult `node_modules/@react-three/fiber/dist/declarations/src/three-types.d.ts` (or the package's own README) for the current type-augmentation setup required for this installed version — this is a fast-moving library and the exact setup can differ from older guides.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json components/home/rasterizeText.ts components/home/ParticleText.tsx
git commit -m "Add Three.js particle-cloud text renderer for CeeDev"
```

---

### Task 5: Home intro orchestration (scroll rig, one-liners, CTA, reduced motion)

**Files:**
- Create: `components/home/usePrefersReducedMotion.ts`
- Create: `components/home/usePrefersReducedMotion.test.ts`
- Create: `components/home/HomeIntro.tsx`
- Create: `components/home/HomeIntro.test.tsx`

**Interfaces:**
- Consumes: `ParticleText` (Task 4), `fadeOpacity` (Task 3), `homeOneLiners` (Task 2).
- Produces: `HomeIntro()` — a Client Component with no required props. Task 6 consumes this (via a dynamic, `ssr: false` import).

- [ ] **Step 1: Write the failing usePrefersReducedMotion tests**

Create `components/home/usePrefersReducedMotion.test.ts`:

```ts
import { describe, it, expect, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

describe('usePrefersReducedMotion', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('returns true when the media query matches', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })

  it('returns false when the media query does not match', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/home/usePrefersReducedMotion.test.ts`
Expected: FAIL — `Cannot find module './usePrefersReducedMotion'`

- [ ] **Step 3: Implement usePrefersReducedMotion**

Create `components/home/usePrefersReducedMotion.ts`. Note this uses a lazy
`useState` initializer (not `useState(false)` + a set-on-mount effect):
with a plain `false` initial value, `HomeIntro`'s first render would always
take the animated `<Canvas>` branch — even for reduced-motion users — because
React commits that first render before effects run, and mounting `<Canvas>`
invokes `react-use-measure`, which throws under jsdom (no `ResizeObserver`)
and would also cause a real one-frame Canvas flash in production for
reduced-motion users. Reading `matchMedia` synchronously in the initializer
fixes both. This is safe specifically because `HomeIntro` is only ever
rendered client-side via `dynamic(..., { ssr: false })` (Task 6), so there's
no SSR/hydration mismatch from touching `window` at render time.

```ts
'use client'

import { useEffect, useState } from 'react'

function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPrefersReducedMotion)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')

    function handleChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches)
    }

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/home/usePrefersReducedMotion.test.ts`
Expected: `2 passed`

- [ ] **Step 5: Write the failing HomeIntro test**

Create `components/home/HomeIntro.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomeIntro } from './HomeIntro'
import { homeOneLiners } from '@/data/content'

describe('HomeIntro', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('renders the static reduced-motion intro with the heading, every one-liner, and the CTA', () => {
    render(<HomeIntro />)
    expect(screen.getByRole('heading', { level: 1, name: 'CeeDev' })).toBeInTheDocument()
    homeOneLiners.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument()
    })
    expect(screen.getByRole('link', { name: 'View My Work' })).toHaveAttribute('href', '/about')
  })
})
```

This test only exercises the reduced-motion branch (forced via the `matchMedia` mock above) — the only branch that doesn't require a real WebGL context. The animated branch is verified manually in Task 6's final step.

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run components/home/HomeIntro.test.tsx`
Expected: FAIL — `Cannot find module './HomeIntro'`

- [ ] **Step 7: Implement HomeIntro**

Create `components/home/HomeIntro.tsx`:

```tsx
'use client'

import { Suspense, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { ParticleText } from './ParticleText'
import { fadeOpacity } from './fadeOpacity'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { homeOneLiners } from '@/data/content'

const CTA_LABEL = 'View My Work'
const CTA_HREF = '/about'
const FADE_EDGE = 0.06
const ONE_LINER_RANGES: Array<[number, number]> = [
  [0.4, 0.58],
  [0.55, 0.73],
  [0.7, 0.88],
]
const CTA_RANGE: [number, number] = [0.85, 1]

function StaticIntro() {
  return (
    <section className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-5xl font-bold text-emerald-400">CeeDev</h1>
      <div className="flex flex-col gap-2">
        {homeOneLiners.map((line) => (
          <p key={line} className="text-lg text-slate-200">
            {line}
          </p>
        ))}
      </div>
      <a
        href={CTA_HREF}
        className="rounded-md bg-[linear-gradient(90deg,#0f766e,#15803d)] px-5 py-3 text-white transition hover:brightness-110"
      >
        {CTA_LABEL}
      </a>
    </section>
  )
}

function FadingLine({ range, children }: { range: [number, number]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = useScroll()

  useFrame(() => {
    if (!ref.current) return
    const opacity = fadeOpacity(scroll.offset, range[0], range[1], FADE_EDGE)
    ref.current.style.opacity = String(opacity)
  })

  return (
    <div ref={ref} className="absolute inset-x-0 flex justify-center" style={{ opacity: 0 }}>
      {children}
    </div>
  )
}

function ScrollOverlay() {
  return (
    <Scroll html style={{ width: '100%' }}>
      <div className="relative h-[400vh] w-full">
        <div className="sticky top-0 flex h-dvh w-full items-center justify-center">
          {homeOneLiners.map((line, index) => (
            <FadingLine key={line} range={ONE_LINER_RANGES[index]}>
              <p className="text-lg text-slate-200">{line}</p>
            </FadingLine>
          ))}
          <FadingLine range={CTA_RANGE}>
            <a
              href={CTA_HREF}
              className="pointer-events-auto rounded-md bg-[linear-gradient(90deg,#0f766e,#15803d)] px-5 py-3 text-white transition hover:brightness-110"
            >
              {CTA_LABEL}
            </a>
          </FadingLine>
        </div>
      </div>
    </Scroll>
  )
}

export function HomeIntro() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <StaticIntro />
  }

  return (
    <div className="h-dvh w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ScrollControls pages={4} damping={0.2}>
          <Suspense fallback={null}>
            <ParticleText />
          </Suspense>
          <ScrollOverlay />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
```

If `@react-three/drei`'s `Scroll`/`ScrollControls`/`useScroll` API differs from what's used above for the installed `10.7.8` version, consult `node_modules/@react-three/drei/dist/index.d.ts` (or the package README) and adjust — the intent to preserve is: a scrollable region roughly `pages * 100vh` tall drives `scroll.offset` from 0 to 1, and each `FadingLine` fades in/out based on `fadeOpacity(scroll.offset, ...)` over its own range.

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run components/home/HomeIntro.test.tsx`
Expected: `1 passed`

- [ ] **Step 9: Run the type checker**

Run: `npx tsc --noEmit`
Expected: no errors (see Task 4 Step 5's note if drei's types don't match)

- [ ] **Step 10: Commit**

```bash
git add components/home/usePrefersReducedMotion.ts components/home/usePrefersReducedMotion.test.ts components/home/HomeIntro.tsx components/home/HomeIntro.test.tsx
git commit -m "Add HomeIntro: scroll rig, one-liner/CTA overlays, reduced-motion fallback"
```

---

### Task 6: Assemble the new Home page

**Files:**
- Create: `components/home/HomeIntroLoader.tsx`
- Modify: `app/page.tsx`
- Delete: `__tests__/page.test.tsx`
- Create: `app/page.test.tsx`

**Interfaces:**
- Consumes: `HomeIntro` (Task 5), `Nav` (Task 1, unchanged).
- Produces: the final `/` route.

- [ ] **Step 1: Create the client-only loader**

Create `components/home/HomeIntroLoader.tsx`:

```tsx
'use client'

import dynamic from 'next/dynamic'

const HomeIntro = dynamic(() => import('./HomeIntro').then((mod) => mod.HomeIntro), {
  ssr: false,
})

export function HomeIntroLoader() {
  return <HomeIntro />
}
```

- [ ] **Step 2: Replace app/page.tsx**

Replace the full contents of `app/page.tsx`:

```tsx
import { Nav } from '@/components/Nav'
import { HomeIntroLoader } from '@/components/home/HomeIntroLoader'

export default function Home() {
  return (
    <>
      <Nav />
      <HomeIntroLoader />
    </>
  )
}
```

- [ ] **Step 3: Remove the obsolete page test and write the new one**

Delete `__tests__/page.test.tsx` (its assertions now live in `app/about/page.test.tsx` from Task 1).

Create `app/page.test.tsx`:

```tsx
import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'
import { ThemeProvider } from '@/components/ThemeProvider'

const originalMatchMedia = window.matchMedia

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: true,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia
})

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

test('Home page renders Nav and the (reduced-motion) intro content', async () => {
  render(
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  )
  expect(screen.getByRole('link', { name: 'CeeDev' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { level: 1, name: 'CeeDev' })).toBeInTheDocument()
  expect(await screen.findByRole('link', { name: 'View My Work' })).toBeInTheDocument()
})
```

This forces the reduced-motion branch (via the `matchMedia` mock) so the lazily-loaded `HomeIntro` never touches WebGL/Canvas in the test, consistent with every other WebGL-adjacent test in this plan. `findByRole` is used (not `getByRole`) because `next/dynamic`'s lazy import resolves asynchronously.

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: all test files pass, including `app/page.test.tsx`, `app/about/page.test.tsx`, `components/Nav.test.tsx`, `components/home/particlePositions.test.ts`, `components/home/fadeOpacity.test.ts`, `components/home/usePrefersReducedMotion.test.ts`, `components/home/HomeIntro.test.tsx`, and every pre-existing test file.

- [ ] **Step 5: Run the type checker**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Run a production build**

Run: `npm run build`
Expected: exits 0. This is the definitive check that the Canvas/Three.js code — which cannot be exercised under Vitest+jsdom — is at least valid enough to compile and that `/` is not accidentally server-rendering WebGL code (the `HomeIntroLoader`'s `ssr: false` dynamic import is what prevents that).

- [ ] **Step 7: Manually verify the animated experience**

Run the dev server (`npm run dev`, or via this project's preview tooling) and in a real browser with `prefers-reduced-motion` NOT set to reduce:
- Visit `/` — confirm the "CeeDev" particle cloud is visible and starts scattered.
- Scroll down — confirm the particles gather into readable "CeeDev" text, then the three one-liners cross-fade in sequence, then the "View My Work" button fades in.
- Click "View My Work" — confirm it navigates to `/about` and the full portfolio renders there.
- Click each Nav link from `/` — confirm each one navigates to the correct `/about#section` anchor.
- In OS/browser settings, enable "reduce motion", reload `/` — confirm the static fallback (heading + all three lines + CTA, no scroll animation) renders instead.

- [ ] **Step 8: Commit**

```bash
git add components/home/HomeIntroLoader.tsx app/page.tsx app/page.test.tsx
git rm __tests__/page.test.tsx
git commit -m "Assemble the new Home page with a client-only Three.js intro"
```

---

## Post-Plan Follow-Up (not part of this plan's scope)

- The particle count/step (`SAMPLE_STEP = 3`), scatter radius, and depth jitter in `ParticleText.tsx` are reasonable starting values, not tuned against a real rendered result (Task 4 has no automated way to verify visual density). Adjust them after the Step 7 manual check in Task 6 if the cloud reads too sparse, too dense, or too shallow.
- The `ONE_LINER_RANGES`/`CTA_RANGE` scroll offsets in `HomeIntro.tsx` are a reasonable starting split of the `pages={4}` scroll track, not tuned against real scroll feel. Adjust after the manual check if the pacing feels off.
