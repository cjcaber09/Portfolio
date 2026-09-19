# Home Intro Contribution Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the Home page's Three.js intro so "CeeDev" is fully formed on the first frame, "Carl John Caber" assembles below it as a smaller contribution-graph-style grid of circles, and once both have held briefly they fade out and are replaced by the (now much larger, bolder) one-liners and CTA.

**Architecture:** Two `<instancedMesh>` circle grids inside the existing R3F `<Canvas>`/`<ScrollControls>` rig, driven by pure, fully-unit-tested modules for scroll timing, colour/shimmer, and viewport-fit scaling. Below 640px width, or under `prefers-reduced-motion`, the page falls back to plain DOM text (`StaticIntro`) with no canvas at all.

**Tech Stack:** Next.js 16 / React 19 / Tailwind v4, `three` ^0.186, `@react-three/fiber` ^9.7, `@react-three/drei` ^10.7, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-19-home-intro-contribution-grid-design.md` — read it if any task here is ambiguous; it is authoritative on *why*, this plan is authoritative on *what to type*.

## Global Constraints

- `ScrollControls` uses `pages={5}` (not 4) — drei's offset spans `pages - 1` = 4 heights of the intro area.
- Scroll ranges, verbatim: `WORDMARK_RANGE = [-1, 0.32]`, `NAME_ASSEMBLY_END = 0.2`, `ONE_LINER_RANGES = [[0.34, 0.54], [0.56, 0.76], [0.78, 2]]`, `CTA_RANGE = [0.84, 2]`, `FADE_EDGE = 0.06`.
- Sample lattice: `SAMPLE_STEP = 4`, `ALPHA_THRESHOLD = 128`, dot radius `= SAMPLE_STEP * 0.34` in raster units.
- Ramp (sRGB hex): `['#15503a', '#05734f', '#0f9e6b', '#2cc98c']`, weighted 20/30/30/20.
- Shimmer: `T0 = 0.988`, `PERIOD_SECONDS = 30`, glide (not a discrete step) — see Task 1.
- `fitScale` options: `margin = 0.2`, `maxWidthPx = 960`.
- Narrow-viewport breakpoint: `(max-width: 639px)`.
- `homeWordmarkName = 'Carl John Caber'` — a new export, `profile.name` is untouched.
- Every material on the wordmark's dots: `toneMapped={false}` (R3F's default ACES tone mapping visibly distorts this ramp — see spec).
- Colours are set via `THREE.Color.setRGB(r, g, b, THREE.SRGBColorSpace)`, never raw hex assignment on `instanceColor`.
- Run `npm test` after every task; it must be green before moving to the next task.

---

## File Structure

New files:
- `components/home/contributionLevels.ts` — ramp, hash-based level/phase assignment, `levelAt`, `rampAt`, `mixRgb`.
- `components/home/scrollTimeline.ts` — every scroll-offset constant, single source of truth.
- `components/home/fitScale.ts` — viewport-fit scale for the wordmark.
- `components/home/useMediaQuery.ts` — generic media-query hook, extracted from `usePrefersReducedMotion`.

Modified:
- `components/home/particlePositions.ts` — adds `Bounds` + `boundsOfPoints`.
- `components/home/rasterizeText.ts` — adds an optional `y` option.
- `components/home/usePrefersReducedMotion.ts` — becomes a thin wrapper over `useMediaQuery`.
- `components/home/ParticleText.tsx` — full rewrite: two instanced circle grids, shimmer, derived scale.
- `components/home/HomeIntro.tsx` — full rewrite: bigger/bolder sentences in their own slot, CTA below it and inert while hidden, keyboard-operable scroll element, narrow-viewport fallback, nav-height-aware layout.
- `app/page.tsx` — flex layout so the intro fills exactly the space below `Nav`.
- `data/content.ts` — adds `homeWordmarkName`, updates one comment.
- `app/page.test.tsx`, `components/home/HomeIntro.test.tsx` — query-aware `matchMedia` mocks, new assertions for the name.

Unchanged: `components/home/fadeOpacity.ts`, `components/home/HomeIntroLoader.tsx`, `components/home/particlePositions.ts`'s existing exports (`sampleTextPoints`, `createScatteredParticles`, `interpolateParticle`), `usePrefersReducedMotion.test.ts`.

---

### Task 1: `contributionLevels.ts` — ramp, hash, shimmer

**Files:**
- Create: `components/home/contributionLevels.ts`
- Test: `components/home/contributionLevels.test.ts`

**Interfaces:**
- Produces: `Rgb { r: number; g: number; b: number }` (channels in `[0, 1]`); `RAMP_HEX: readonly string[]`; `assignLevel(x: number, y: number): number` (integer 0–3); `assignPhase(x: number, y: number): number` (`[0, 1)`); `levelAt(baseLevel: number, phase: number, timeSeconds: number): number` (fractional, `[0, 3]`); `rampAt(level: number): Rgb`; `mixRgb(a: Rgb, b: Rgb, t: number): Rgb`.

- [ ] **Step 1: Write the failing tests**

```ts
// components/home/contributionLevels.test.ts
import { describe, it, expect } from 'vitest'
import { assignLevel, assignPhase, levelAt, rampAt, mixRgb, RAMP_HEX } from './contributionLevels'

describe('rampAt', () => {
  it('returns the exact ramp colour at integer levels', () => {
    expect(rampAt(0)).toEqual({ r: 0x15 / 255, g: 0x50 / 255, b: 0x3a / 255 })
    expect(rampAt(3)).toEqual({ r: 0x2c / 255, g: 0xc9 / 255, b: 0x8c / 255 })
  })

  it('interpolates between neighbouring levels at fractional values', () => {
    const level1 = rampAt(1)
    const level2 = rampAt(2)
    const midpoint = rampAt(1.5)
    expect(midpoint.r).toBeCloseTo((level1.r + level2.r) / 2, 10)
    expect(midpoint.g).toBeCloseTo((level1.g + level2.g) / 2, 10)
    expect(midpoint.b).toBeCloseTo((level1.b + level2.b) / 2, 10)
  })

  it('clamps below 0 and above the top level', () => {
    expect(rampAt(-5)).toEqual(rampAt(0))
    expect(rampAt(99)).toEqual(rampAt(RAMP_HEX.length - 1))
  })
})

describe('mixRgb', () => {
  it('is a at t=0 and b at t=1', () => {
    const a = { r: 0, g: 0, b: 0 }
    const b = { r: 1, g: 1, b: 1 }
    expect(mixRgb(a, b, 0)).toEqual(a)
    expect(mixRgb(a, b, 1)).toEqual(b)
  })

  it('is the midpoint at t=0.5', () => {
    const a = { r: 0, g: 0.2, b: 1 }
    const b = { r: 1, g: 0.8, b: 0 }
    const mid = mixRgb(a, b, 0.5)
    expect(mid.r).toBeCloseTo(0.5, 10)
    expect(mid.g).toBeCloseTo(0.5, 10)
    expect(mid.b).toBeCloseTo(0.5, 10)
  })

  it('clamps t outside [0, 1]', () => {
    const a = { r: 0, g: 0, b: 0 }
    const b = { r: 1, g: 1, b: 1 }
    expect(mixRgb(a, b, -1)).toEqual(a)
    expect(mixRgb(a, b, 2)).toEqual(b)
  })
})

describe('assignLevel / assignPhase', () => {
  it('is deterministic for the same position', () => {
    expect(assignLevel(40, 12)).toBe(assignLevel(40, 12))
    expect(assignPhase(40, 12)).toBe(assignPhase(40, 12))
  })

  it('returns a phase in [0, 1)', () => {
    for (let x = 0; x < 40; x += 4) {
      for (let y = 0; y < 40; y += 4) {
        const phase = assignPhase(x, y)
        expect(phase).toBeGreaterThanOrEqual(0)
        expect(phase).toBeLessThan(1)
      }
    }
  })

  it('roughly matches the 20/30/30/20 weighting over a large grid-aligned sample', () => {
    const counts = [0, 0, 0, 0]
    let total = 0
    for (let x = 0; x < 660; x += 4) {
      for (let y = 0; y < 200; y += 4) {
        counts[assignLevel(x, y)]++
        total++
      }
    }
    const fractions = counts.map((c) => c / total)
    expect(fractions[0]).toBeGreaterThan(0.15)
    expect(fractions[0]).toBeLessThan(0.25)
    expect(fractions[1]).toBeGreaterThan(0.25)
    expect(fractions[1]).toBeLessThan(0.35)
    expect(fractions[2]).toBeGreaterThan(0.25)
    expect(fractions[2]).toBeLessThan(0.35)
    expect(fractions[3]).toBeGreaterThan(0.15)
    expect(fractions[3]).toBeLessThan(0.25)
  })

  it('assigns phase independently of level (mean phase per level is close to 0.5)', () => {
    const sums = [0, 0, 0, 0]
    const counts = [0, 0, 0, 0]
    for (let x = 0; x < 660; x += 4) {
      for (let y = 0; y < 200; y += 4) {
        const level = assignLevel(x, y)
        sums[level] += assignPhase(x, y)
        counts[level]++
      }
    }
    for (let level = 0; level < 4; level++) {
      const mean = sums[level] / counts[level]
      expect(mean).toBeGreaterThan(0.4)
      expect(mean).toBeLessThan(0.6)
    }
  })
})

describe('levelAt', () => {
  it('holds exactly at baseLevel while the sine is within the threshold', () => {
    // phase=0, time=0 -> sin(0) = 0, |0| <= T0
    expect(levelAt(2, 0, 0)).toBe(2)
  })

  it('never returns outside [0, 3], including at the clamping edges', () => {
    // phase=0.75, time=0 -> sin(2*pi*0.75) = -1, base 0 would go negative without clamping
    expect(levelAt(0, 0.75, 0)).toBe(0)
    // phase=0.25, time=0 -> sin(2*pi*0.25) = 1, base 3 would exceed 3 without clamping
    expect(levelAt(3, 0.25, 0)).toBe(3)
    for (let t = 0; t < 30; t += 0.5) {
      for (const base of [0, 1, 2, 3]) {
        const level = levelAt(base, 0.137, t)
        expect(level).toBeGreaterThanOrEqual(0)
        expect(level).toBeLessThanOrEqual(3)
      }
    }
  })

  it('changes continuously: a 1ms step never moves the level by more than 0.01', () => {
    for (let t = 0; t < 30; t += 0.01) {
      const a = levelAt(2, 0.137, t)
      const b = levelAt(2, 0.137, t + 0.001)
      expect(Math.abs(b - a)).toBeLessThan(0.01)
    }
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- contributionLevels`
Expected: FAIL — `Cannot find module './contributionLevels'`

- [ ] **Step 3: Implement**

```ts
// components/home/contributionLevels.ts
export interface Rgb {
  r: number
  g: number
  b: number
}

export const RAMP_HEX = ['#15503a', '#05734f', '#0f9e6b', '#2cc98c'] as const

function hexToRgb(hex: string): Rgb {
  const value = parseInt(hex.slice(1), 16)
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  }
}

const RAMP: Rgb[] = RAMP_HEX.map(hexToRgb)

const LEVEL_WEIGHTS = [0.2, 0.3, 0.3, 0.2]
const T0 = 0.988
const PERIOD_SECONDS = 30

// FNV-1a mixed with a full murmur3 finalizer. A single xorshift-multiply
// round (as used in the throwaway visual-companion mockups this design was
// reviewed with) does not fully avalanche grid-aligned inputs: sampled at
// multiples of SAMPLE_STEP, it collapsed the level distribution to two
// buckets and made assignPhase perfectly correlated with assignLevel. This
// finalizer was verified (see the design's review history) to produce a
// ~20/30/30/20 split and a mean phase near 0.5 per level on real,
// grid-aligned (x, y) input.
function hash2D(x: number, y: number, salt: number): number {
  let h = 2166136261 ^ salt
  h = Math.imul(h ^ x, 16777619)
  h = Math.imul(h ^ y, 16777619)
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

export function assignLevel(x: number, y: number): number {
  const r = hash2D(x, y, 0)
  let cumulative = 0
  for (let level = 0; level < LEVEL_WEIGHTS.length; level++) {
    cumulative += LEVEL_WEIGHTS[level]
    if (r < cumulative) return level
  }
  return LEVEL_WEIGHTS.length - 1
}

export function assignPhase(x: number, y: number): number {
  // salt=1: an independent hash output from assignLevel's salt=0, so a
  // dot's brightness and its shimmer timing never correlate. See
  // components/home/contributionLevels.test.ts's mean-phase-per-level test.
  return hash2D(x, y, 1)
}

export function levelAt(baseLevel: number, phase: number, timeSeconds: number): number {
  const s = Math.sin(2 * Math.PI * (timeSeconds / PERIOD_SECONDS + phase))
  const magnitude = Math.abs(s)
  const f = Math.min(Math.max((magnitude - T0) / (1 - T0), 0), 1)
  const direction = Math.sign(s)
  return Math.min(Math.max(baseLevel + direction * f, 0), 3)
}

export function rampAt(level: number): Rgb {
  const clamped = Math.min(Math.max(level, 0), RAMP.length - 1)
  const lower = Math.floor(clamped)
  const upper = Math.min(lower + 1, RAMP.length - 1)
  const t = clamped - lower
  return {
    r: RAMP[lower].r + (RAMP[upper].r - RAMP[lower].r) * t,
    g: RAMP[lower].g + (RAMP[upper].g - RAMP[lower].g) * t,
    b: RAMP[lower].b + (RAMP[upper].b - RAMP[lower].b) * t,
  }
}

export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const clampedT = Math.min(Math.max(t, 0), 1)
  return {
    r: a.r + (b.r - a.r) * clampedT,
    g: a.g + (b.g - a.g) * clampedT,
    b: a.b + (b.b - a.b) * clampedT,
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- contributionLevels`
Expected: PASS (all tests in the file)

- [ ] **Step 5: Commit**

```bash
git add components/home/contributionLevels.ts components/home/contributionLevels.test.ts
git commit -m "feat: add contribution-grid ramp, hash assignment, and shimmer

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: `particlePositions.ts` — `boundsOfPoints`

**Files:**
- Modify: `components/home/particlePositions.ts`
- Test: `components/home/particlePositions.test.ts` (extend the existing file)

**Interfaces:**
- Consumes: `Point2D` (already defined in this file).
- Produces: `Bounds { minX: number; maxX: number; minY: number; maxY: number; width: number; height: number; centerX: number; centerY: number }`; `boundsOfPoints(points: Point2D[]): Bounds | null`.

- [ ] **Step 1: Write the failing tests**

Append to `components/home/particlePositions.test.ts` (add the import and the new `describe` block; do not touch the existing tests):

```ts
import { sampleTextPoints, createScatteredParticles, interpolateParticle, boundsOfPoints } from './particlePositions'
```

```ts
describe('boundsOfPoints', () => {
  it('returns null for an empty array', () => {
    expect(boundsOfPoints([])).toBeNull()
  })

  it('returns a zero-size box centered on a single point', () => {
    const bounds = boundsOfPoints([{ x: 10, y: 20 }])
    expect(bounds).toEqual({
      minX: 10,
      maxX: 10,
      minY: 20,
      maxY: 20,
      width: 0,
      height: 0,
      centerX: 10,
      centerY: 20,
    })
  })

  it('finds the true extremes and centre of an asymmetric set', () => {
    const bounds = boundsOfPoints([
      { x: 0, y: 100 },
      { x: 50, y: 40 },
      { x: 30, y: 0 },
    ])
    expect(bounds).toEqual({
      minX: 0,
      maxX: 50,
      minY: 0,
      maxY: 100,
      width: 50,
      height: 100,
      centerX: 25,
      centerY: 50,
    })
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- particlePositions`
Expected: FAIL — `boundsOfPoints is not a function` (or "does not provide an export named")

- [ ] **Step 3: Implement**

Append to `components/home/particlePositions.ts` (keep every existing export untouched):

```ts
export interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
  width: number
  height: number
  centerX: number
  centerY: number
}

export function boundsOfPoints(points: Point2D[]): Bounds | null {
  if (points.length === 0) return null

  let minX = points[0].x
  let maxX = points[0].x
  let minY = points[0].y
  let maxY = points[0].y

  for (const point of points) {
    if (point.x < minX) minX = point.x
    if (point.x > maxX) maxX = point.x
    if (point.y < minY) minY = point.y
    if (point.y > maxY) maxY = point.y
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- particlePositions`
Expected: PASS (all tests, old and new)

- [ ] **Step 5: Commit**

```bash
git add components/home/particlePositions.ts components/home/particlePositions.test.ts
git commit -m "feat: add boundsOfPoints for the shared wordmark origin

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: `fitScale.ts` — viewport-fit scale

**Files:**
- Create: `components/home/fitScale.ts`
- Test: `components/home/fitScale.test.ts`

**Interfaces:**
- Consumes: `Bounds` from `./particlePositions` (Task 2).
- Produces: `Viewport { width: number; height: number }`; `FitScaleOptions { margin: number; maxWidthPx: number; canvasWidthPx: number }`; `fitScale(bounds: Bounds | null, viewport: Viewport, options: FitScaleOptions): number`.

- [ ] **Step 1: Write the failing tests**

```ts
// components/home/fitScale.test.ts
import { describe, it, expect } from 'vitest'
import { fitScale } from './fitScale'
import type { Bounds } from './particlePositions'

function makeBounds(width: number, height: number): Bounds {
  return { minX: 0, maxX: width, minY: 0, maxY: height, width, height, centerX: width / 2, centerY: height / 2 }
}

describe('fitScale', () => {
  it('fits width to the margin when width binds', () => {
    const bounds = makeBounds(100, 20)
    const scale = fitScale(bounds, { width: 1000, height: 500 }, { margin: 0.2, maxWidthPx: 1_000_000, canvasWidthPx: 1000 })
    // 1000 * 0.8 / 100 = 8; height candidate is 500*0.8/20=20; cap is effectively infinite
    expect(scale).toBeCloseTo(8, 10)
  })

  it('fits height to the margin when height binds on a short, wide viewport', () => {
    const bounds = makeBounds(10, 100)
    const scale = fitScale(bounds, { width: 1000, height: 200 }, { margin: 0.2, maxWidthPx: 1_000_000, canvasWidthPx: 1000 })
    // width candidate: 1000*0.8/10=80; height candidate: 200*0.8/100=1.6 (binds)
    expect(scale).toBeCloseTo(1.6, 10)
  })

  it('the pixel width cap binds on a large screen', () => {
    const bounds = makeBounds(100, 10)
    const scale = fitScale(bounds, { width: 100_000, height: 100_000 }, { margin: 0.2, maxWidthPx: 50, canvasWidthPx: 1000 })
    // maxWidthWorld = 50 * 100000 / 1000 = 5000; cap candidate = 5000/100 = 50
    // width candidate: 100000*0.8/100=800; height candidate: 100000*0.8/10=8000
    expect(scale).toBeCloseTo(50, 10)
  })

  it('a zero-height box (single row) is constrained by the width terms alone', () => {
    const bounds = makeBounds(50, 0)
    const scale = fitScale(bounds, { width: 1000, height: 1 }, { margin: 0.2, maxWidthPx: 1_000_000, canvasWidthPx: 1000 })
    // height=0 must not divide-by-zero or force scale to 0/Infinity; width candidate: 1000*0.8/50=16
    expect(scale).toBeCloseTo(16, 10)
  })

  it('a single point (zero width and height) falls back to a 1:1 raster-to-CSS-pixel mapping', () => {
    const bounds = makeBounds(0, 0)
    const scale = fitScale(bounds, { width: 1000, height: 500 }, { margin: 0.2, maxWidthPx: 1_000_000, canvasWidthPx: 2000 })
    expect(scale).toBeCloseTo(1000 / 2000, 10)
  })

  it('null bounds falls back to the same 1:1 mapping', () => {
    const scale = fitScale(null, { width: 1000, height: 500 }, { margin: 0.2, maxWidthPx: 1_000_000, canvasWidthPx: 2000 })
    expect(scale).toBeCloseTo(1000 / 2000, 10)
  })

  it('never returns Infinity or NaN for degenerate or extreme inputs', () => {
    const cases: Array<[Bounds | null, { width: number; height: number }]> = [
      [makeBounds(0, 0), { width: 0, height: 0 }],
      [makeBounds(1000, 1000), { width: 1, height: 1 }],
      [null, { width: 1, height: 1 }],
    ]
    for (const [bounds, viewport] of cases) {
      const scale = fitScale(bounds, viewport, { margin: 0.2, maxWidthPx: 960, canvasWidthPx: 1 })
      expect(Number.isFinite(scale)).toBe(true)
    }
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- fitScale`
Expected: FAIL — `Cannot find module './fitScale'`

- [ ] **Step 3: Implement**

```ts
// components/home/fitScale.ts
import type { Bounds } from './particlePositions'

export interface Viewport {
  width: number
  height: number
}

export interface FitScaleOptions {
  margin: number
  maxWidthPx: number
  canvasWidthPx: number
}

export function fitScale(bounds: Bounds | null, viewport: Viewport, options: FitScaleOptions): number {
  const fallback = viewport.width / options.canvasWidthPx
  if (!bounds) return fallback

  const maxWidthWorld = (options.maxWidthPx / options.canvasWidthPx) * viewport.width
  const candidates: number[] = []

  if (bounds.width > 0) {
    candidates.push((viewport.width * (1 - options.margin)) / bounds.width)
    candidates.push(maxWidthWorld / bounds.width)
  }
  if (bounds.height > 0) {
    candidates.push((viewport.height * (1 - options.margin)) / bounds.height)
  }

  if (candidates.length === 0) return fallback
  return Math.min(...candidates)
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- fitScale`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/home/fitScale.ts components/home/fitScale.test.ts
git commit -m "feat: add fitScale for viewport-fit wordmark sizing

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: `scrollTimeline.ts` — single source of truth for scroll ranges, plus `homeWordmarkName`

**Files:**
- Create: `components/home/scrollTimeline.ts`
- Test: `components/home/scrollTimeline.test.ts`
- Modify: `data/content.ts` (add `homeWordmarkName`, update one comment)

**Interfaces:**
- Consumes: `fadeOpacity` from `./fadeOpacity` (existing, unchanged); `homeOneLiners` from `@/data/content` (existing).
- Produces: `FADE_EDGE: number`; `WORDMARK_RANGE: [number, number]`; `NAME_ASSEMBLY_END: number`; `ONE_LINER_RANGES: Array<[number, number]>`; `UNREACHABLE_RANGE: [number, number]`; `CTA_RANGE: [number, number]`; `SCROLL_PAGES: number`. Also `homeWordmarkName: string` from `@/data/content`.

- [ ] **Step 1: Write the failing tests**

```ts
// components/home/scrollTimeline.test.ts
import { describe, it, expect } from 'vitest'
import { fadeOpacity } from './fadeOpacity'
import { FADE_EDGE, WORDMARK_RANGE, ONE_LINER_RANGES, CTA_RANGE } from './scrollTimeline'
import { homeOneLiners } from '@/data/content'

function opacityAt(offset: number, range: [number, number]): number {
  return fadeOpacity(offset, range[0], range[1], FADE_EDGE)
}

describe('scrollTimeline', () => {
  it('keeps the wordmark and every one-liner mutually exclusive across the reachable scroll range', () => {
    const exclusiveRanges = [WORDMARK_RANGE, ...ONE_LINER_RANGES]
    for (let i = 0; i <= 1000; i++) {
      const offset = i / 1000
      const visibleCount = exclusiveRanges.filter((range) => opacityAt(offset, range) > 0).length
      expect(visibleCount, `offset ${offset} had ${visibleCount} visible`).toBeLessThanOrEqual(1)
    }
  })

  it('shows the wordmark at full opacity on the very first frame', () => {
    expect(opacityAt(0, WORDMARK_RANGE)).toBe(1)
  })

  it('shows the last one-liner and the CTA at full opacity at maximum scroll', () => {
    expect(opacityAt(1, ONE_LINER_RANGES[ONE_LINER_RANGES.length - 1])).toBe(1)
    expect(opacityAt(1, CTA_RANGE)).toBe(1)
  })

  it('has exactly one range per one-liner', () => {
    expect(ONE_LINER_RANGES).toHaveLength(homeOneLiners.length)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- scrollTimeline`
Expected: FAIL — `Cannot find module './scrollTimeline'`

- [ ] **Step 3: Implement `scrollTimeline.ts`**

```ts
// components/home/scrollTimeline.ts
// Every scroll-offset constant for the Home intro lives here, because the
// wordmark (faded inside ParticleText, which runs inside the Canvas) and
// the one-liners/CTA (faded in HomeIntro, outside the Canvas) must never
// overlap — see the "handoff invariant" test in scrollTimeline.test.ts.
// A retune made in only one of those two components is how a future
// change reintroduces overlap.

export const FADE_EDGE = 0.06

// fadeOpacity treats `from` as exclusive-below (offset <= from returns 0).
// A `from` of 0 would make the wordmark invisible on the one frame it must
// be visible (offset === 0). -1 puts the fade-in edge at -0.94, unreachable,
// so offset 0 always sits on the plateau.
export const WORDMARK_RANGE: [number, number] = [-1, 0.32]

// Position (not opacity) assembly range for "Carl John Caber".
export const NAME_ASSEMBLY_END = 0.2

export const ONE_LINER_RANGES: Array<[number, number]> = [
  [0.34, 0.54],
  [0.56, 0.76],
  [0.78, 2],
]

// fadeOpacity(offset, 1, 1, edge) is 0 for every offset in the reachable
// [0, 1] range — a safe fallback if ONE_LINER_RANGES[index] is ever
// undefined, rather than a crash.
export const UNREACHABLE_RANGE: [number, number] = [1, 1]

// fadeOpacity treats `to` as exclusive (offset >= to returns 0), so a
// range ending at 1 would fade the CTA back out exactly at max scroll.
export const CTA_RANGE: [number, number] = [0.84, 2]

// drei's ScrollControls makes offset 0->1 span (pages - 1) heights of the
// intro area. 5 pages = 4 heights of scrolling across the full track.
export const SCROLL_PAGES = 5
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- scrollTimeline`
Expected: PASS

- [ ] **Step 5: Add `homeWordmarkName` and update the length-coupling comment**

Read `data/content.ts`'s current `homeOneLiners` block before editing (it ends the file). Replace:

```ts
// Each entry corresponds by index to a scroll-fade range in
// components/home/HomeIntro.tsx's ONE_LINER_RANGES — keep both arrays the
// same length when editing either one.
export const homeOneLiners: string[] = [
  'Full-Stack Web Developer.',
  'Building scalable web experiences.',
  'From legacy IBM i to modern React.',
]
```

with:

```ts
// Each entry corresponds by index to a scroll-fade range in
// components/home/scrollTimeline.ts's ONE_LINER_RANGES — keep both arrays
// the same length when editing either one (enforced by
// components/home/scrollTimeline.test.ts).
export const homeOneLiners: string[] = [
  'Full-Stack Web Developer.',
  'Building scalable web experiences.',
  'From legacy IBM i to modern React.',
]

// The Home page wordmark's second line. Deliberately without the middle
// initial `profile.name` carries — three characters narrower on an
// already width-constrained line, and a wordmark, unlike the resume-
// accurate Hero/Contact sections, is not the place for a legal name.
export const homeWordmarkName = 'Carl John Caber'
```

- [ ] **Step 6: Run the full suite to confirm nothing else broke**

Run: `npm test`
Expected: PASS (all files, including the untouched `usePrefersReducedMotion.test.ts`, `fadeOpacity.test.ts`, `particlePositions.test.ts`, `HomeIntro.test.tsx`, `app/page.test.tsx` — none of these reference the changed comment or the new export yet)

- [ ] **Step 7: Commit**

```bash
git add components/home/scrollTimeline.ts components/home/scrollTimeline.test.ts data/content.ts
git commit -m "feat: add scrollTimeline module and homeWordmarkName

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: `useMediaQuery.ts` — extract from `usePrefersReducedMotion`

**Files:**
- Create: `components/home/useMediaQuery.ts`
- Test: `components/home/useMediaQuery.test.ts`
- Modify: `components/home/usePrefersReducedMotion.ts`

**Interfaces:**
- Produces: `useMediaQuery(query: string): boolean`.
- `usePrefersReducedMotion(): boolean` keeps its existing signature; its test file (`usePrefersReducedMotion.test.ts`) is not touched.

- [ ] **Step 1: Write the failing tests**

```ts
// components/home/useMediaQuery.test.ts
import { describe, it, expect, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from './useMediaQuery'

describe('useMediaQuery', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  function mockMatchMedia(initial: Record<string, boolean>) {
    const state = { ...initial }
    const listenersByQuery = new Map<string, Array<(event: MediaQueryListEvent) => void>>()

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      get matches() {
        return state[query] ?? false
      },
      media: query,
      addEventListener: (_: string, handler: (event: MediaQueryListEvent) => void) => {
        listenersByQuery.set(query, [...(listenersByQuery.get(query) ?? []), handler])
      },
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia

    return {
      fire(query: string, matches: boolean) {
        state[query] = matches
        for (const handler of listenersByQuery.get(query) ?? []) {
          handler({ matches } as MediaQueryListEvent)
        }
      },
    }
  }

  it('returns the initial match synchronously on first render', () => {
    mockMatchMedia({ '(min-width: 100px)': true })
    const { result } = renderHook(() => useMediaQuery('(min-width: 100px)'))
    expect(result.current).toBe(true)
  })

  it('responds to change events', () => {
    const media = mockMatchMedia({ '(min-width: 100px)': false })
    const { result } = renderHook(() => useMediaQuery('(min-width: 100px)'))
    expect(result.current).toBe(false)

    act(() => {
      media.fire('(min-width: 100px)', true)
    })

    expect(result.current).toBe(true)
  })

  it('returns independent results for two different queries', () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': true,
      '(max-width: 639px)': false,
    })

    const { result: reducedMotion } = renderHook(() => useMediaQuery('(prefers-reduced-motion: reduce)'))
    const { result: narrowViewport } = renderHook(() => useMediaQuery('(max-width: 639px)'))

    expect(reducedMotion.current).toBe(true)
    expect(narrowViewport.current).toBe(false)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- useMediaQuery`
Expected: FAIL — `Cannot find module './useMediaQuery'`

- [ ] **Step 3: Implement `useMediaQuery.ts`**

```ts
// components/home/useMediaQuery.ts
'use client'

import { useEffect, useState } from 'react'

function getMatches(query: string): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(query).matches
}

export function useMediaQuery(query: string): boolean {
  // Lazy initializer: this must run during the render itself, not in an
  // effect after it. usePrefersReducedMotion (the first consumer of this
  // pattern) originally used `useState(false)` plus a correcting effect,
  // which meant the very first render — before that effect ever ran —
  // could take the wrong branch in HomeIntro and throw during that render
  // under jsdom. Preserved here for every consumer, not just that first one.
  const [matches, setMatches] = useState(() => getMatches(query))

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)

    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
```

- [ ] **Step 4: Run the new tests to verify they pass**

Run: `npm test -- useMediaQuery`
Expected: PASS

- [ ] **Step 5: Redefine `usePrefersReducedMotion` in terms of it**

Replace the full contents of `components/home/usePrefersReducedMotion.ts`:

```ts
// components/home/usePrefersReducedMotion.ts
'use client'

import { useMediaQuery } from './useMediaQuery'

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
```

- [ ] **Step 6: Run the existing reduced-motion tests to confirm they still pass untouched**

Run: `npm test -- usePrefersReducedMotion`
Expected: PASS (file itself is not modified — this confirms the refactor is behavior-preserving)

- [ ] **Step 7: Run the full suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add components/home/useMediaQuery.ts components/home/useMediaQuery.test.ts components/home/usePrefersReducedMotion.ts
git commit -m "refactor: extract useMediaQuery from usePrefersReducedMotion

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: `rasterizeText.ts` — optional `y` placement

**Files:**
- Modify: `components/home/rasterizeText.ts`

**Interfaces:**
- Produces: `rasterizeText(text: string, options: { width: number; height: number; fontSize: number; fontFamily: string; y?: number }): RasterizedText` — omitting `y` preserves today's `height / 2` centering exactly.

This file is browser-only Canvas 2D code with no existing unit test (per the codebase's established convention — jsdom has no real canvas), so there is no test step here; it is verified visually in Task 9's manual pass.

- [ ] **Step 1: Edit the function signature and the one line that uses it**

In `components/home/rasterizeText.ts`, change:

```ts
export function rasterizeText(
  text: string,
  options: { width: number; height: number; fontSize: number; fontFamily: string }
): RasterizedText {
```

to:

```ts
export function rasterizeText(
  text: string,
  options: { width: number; height: number; fontSize: number; fontFamily: string; y?: number }
): RasterizedText {
```

and change:

```ts
  ctx.fillText(text, options.width / 2, options.height / 2)
```

to:

```ts
  ctx.fillText(text, options.width / 2, options.y ?? options.height / 2)
```

- [ ] **Step 2: Run the full suite to confirm nothing else broke**

Run: `npm test`
Expected: PASS (no test references this file directly; this confirms the edit didn't break the build)

- [ ] **Step 3: Commit**

```bash
git add components/home/rasterizeText.ts
git commit -m "feat: add optional y placement to rasterizeText

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: `ParticleText.tsx` — two instanced circle grids

**Files:**
- Modify: `components/home/ParticleText.tsx` (full rewrite)

**Interfaces:**
- Consumes: `rasterizeText` (Task 6), `sampleTextPoints` / `createScatteredParticles` / `interpolateParticle` / `boundsOfPoints` / `Point2D` / `ScatteredParticle` from `./particlePositions`, `assignLevel` / `assignPhase` / `levelAt` / `rampAt` / `mixRgb` from `./contributionLevels` (Task 1), `fitScale` from `./fitScale` (Task 3), `WORDMARK_RANGE` / `NAME_ASSEMBLY_END` / `FADE_EDGE` from `./scrollTimeline` (Task 4), `fadeOpacity` from `./fadeOpacity` (existing), `homeWordmarkName` from `@/data/content` (Task 4).
- Produces: `ParticleText()` — a React component, same export shape as today, still expected to be rendered inside `<ScrollControls>` inside `<Canvas>`.

This is WebGL/R3F code and cannot run under jsdom (per this codebase's established convention — see `HomeIntro.test.tsx`'s comments and the spec's Testing section). There is no unit test for this file; it is verified visually in Task 9.

- [ ] **Step 1: Replace the full contents of `components/home/ParticleText.tsx`**

```tsx
// components/home/ParticleText.tsx
'use client'

import { useMemo, useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { rasterizeText } from './rasterizeText'
import {
  sampleTextPoints,
  createScatteredParticles,
  interpolateParticle,
  boundsOfPoints,
  type Point2D,
  type ScatteredParticle,
} from './particlePositions'
import { assignLevel, assignPhase, levelAt, rampAt, mixRgb } from './contributionLevels'
import { fitScale } from './fitScale'
import { WORDMARK_RANGE, NAME_ASSEMBLY_END, FADE_EDGE } from './scrollTimeline'
import { fadeOpacity } from './fadeOpacity'
import { homeWordmarkName } from '@/data/content'

const RASTER_WIDTH = 660
const RASTER_HEIGHT = 200
const CEEDEV_TEXT = 'CeeDev'
const CEEDEV_FONT_SIZE = 84
const CEEDEV_Y = 72
const NAME_FONT_SIZE = 42
const NAME_Y = 145
const SAMPLE_STEP = 4
const ALPHA_THRESHOLD = 128
const DOT_RADIUS = SAMPLE_STEP * 0.34
const DOT_SEGMENTS = 10
const DEPTH_JITTER = 1.2
const SCATTER_RADIUS = 400
const FIT_MARGIN = 0.2
const FIT_MAX_WIDTH_PX = 960
const FONT_FAMILY = 'system-ui, sans-serif'

interface Lattice {
  particles: ScatteredParticle[]
  levels: number[]
  phases: number[]
}

function buildLattice(points: Point2D[], centerX: number, centerY: number): Lattice {
  const particles = createScatteredParticles(points, {
    centerX,
    centerY,
    depth: DEPTH_JITTER,
    scatterRadius: SCATTER_RADIUS,
  })
  return {
    particles,
    levels: points.map((point) => assignLevel(point.x, point.y)),
    phases: points.map((point) => assignPhase(point.x, point.y)),
  }
}

export function ParticleText() {
  const scroll = useScroll()
  const viewport = useThree((state) => state.viewport)
  const canvasWidthPx = useThree((state) => state.size.width)

  const ceeDevMeshRef = useRef<THREE.InstancedMesh>(null)
  const nameMeshRef = useRef<THREE.InstancedMesh>(null)

  // Rasterizing and sampling both lines is expensive and the text never
  // changes, so this only runs once. Both lines are rasterized at
  // identical canvas dimensions and sampled at the identical step so they
  // land on one continuous lattice, and their combined bounds (not the
  // canvas's own centre) become the single shared world-space origin both
  // lines are built around — see the design spec's "Both lines share one
  // world-space origin" section for why this must not be done per-line.
  const { ceeDev, name, bounds } = useMemo(() => {
    const ceeDevImage = rasterizeText(CEEDEV_TEXT, {
      width: RASTER_WIDTH,
      height: RASTER_HEIGHT,
      fontSize: CEEDEV_FONT_SIZE,
      fontFamily: FONT_FAMILY,
      y: CEEDEV_Y,
    })
    const nameImage = rasterizeText(homeWordmarkName, {
      width: RASTER_WIDTH,
      height: RASTER_HEIGHT,
      fontSize: NAME_FONT_SIZE,
      fontFamily: FONT_FAMILY,
      y: NAME_Y,
    })

    const ceeDevPoints = sampleTextPoints(ceeDevImage, SAMPLE_STEP, ALPHA_THRESHOLD)
    const namePoints = sampleTextPoints(nameImage, SAMPLE_STEP, ALPHA_THRESHOLD)
    const combinedBounds = boundsOfPoints([...ceeDevPoints, ...namePoints])
    const centerX = combinedBounds?.centerX ?? RASTER_WIDTH / 2
    const centerY = combinedBounds?.centerY ?? RASTER_HEIGHT / 2

    return {
      ceeDev: buildLattice(ceeDevPoints, centerX, centerY),
      name: buildLattice(namePoints, centerX, centerY),
      bounds: combinedBounds,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rasterizes fixed, constant text; intentionally runs once
  }, [])

  const scale = useMemo(
    () =>
      fitScale(bounds, viewport, {
        margin: FIT_MARGIN,
        maxWidthPx: FIT_MAX_WIDTH_PX,
        canvasWidthPx,
      }),
    [bounds, viewport.width, viewport.height, canvasWidthPx]
  )

  // "CeeDev" never moves: its instance matrices are written once, here,
  // and never touched again. Its per-frame cost is colour only (shimmer).
  useLayoutEffect(() => {
    const mesh = ceeDevMeshRef.current
    if (!mesh) return
    const matrix = new THREE.Matrix4()
    for (let i = 0; i < ceeDev.particles.length; i++) {
      const point = interpolateParticle(ceeDev.particles[i], 1)
      matrix.setPosition(point.x, point.y, point.z)
      mesh.setMatrixAt(i, matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [ceeDev])

  const tempColor = useMemo(() => new THREE.Color(), [])
  const tempMatrix = useMemo(() => new THREE.Matrix4(), [])

  useFrame((state) => {
    const ceeDevMesh = ceeDevMeshRef.current
    const nameMesh = nameMeshRef.current
    if (!ceeDevMesh || !nameMesh) return

    const wordmarkOpacity = fadeOpacity(scroll.offset, WORDMARK_RANGE[0], WORDMARK_RANGE[1], FADE_EDGE)

    if (wordmarkOpacity <= 0) {
      // Nothing is visible for the remaining ~68% of the scroll track once
      // the wordmark has faded out — skip every per-frame computation, not
      // just the paint.
      ceeDevMesh.visible = false
      nameMesh.visible = false
      return
    }

    ceeDevMesh.visible = true
    nameMesh.visible = true
    ;(ceeDevMesh.material as THREE.MeshBasicMaterial).opacity = wordmarkOpacity
    ;(nameMesh.material as THREE.MeshBasicMaterial).opacity = wordmarkOpacity

    const time = state.clock.elapsedTime
    const progress = THREE.MathUtils.clamp(scroll.offset / NAME_ASSEMBLY_END, 0, 1)
    const floor = rampAt(0)

    for (let i = 0; i < ceeDev.particles.length; i++) {
      const target = rampAt(levelAt(ceeDev.levels[i], ceeDev.phases[i], time))
      tempColor.setRGB(target.r, target.g, target.b, THREE.SRGBColorSpace)
      ceeDevMesh.setColorAt(i, tempColor)
    }
    if (ceeDevMesh.instanceColor) ceeDevMesh.instanceColor.needsUpdate = true

    for (let i = 0; i < name.particles.length; i++) {
      const point = interpolateParticle(name.particles[i], progress)
      tempMatrix.setPosition(point.x, point.y, point.z)
      nameMesh.setMatrixAt(i, tempMatrix)

      // Shimmer picks the target colour first; that target is then mixed
      // from the floor by `progress`. Mixing toward the base colour first
      // and applying shimmer after would let shimmer move dots mid-flight.
      const target = rampAt(levelAt(name.levels[i], name.phases[i], time))
      const mixed = mixRgb(floor, target, progress)
      tempColor.setRGB(mixed.r, mixed.g, mixed.b, THREE.SRGBColorSpace)
      nameMesh.setColorAt(i, tempColor)
    }
    nameMesh.instanceMatrix.needsUpdate = true
    if (nameMesh.instanceColor) nameMesh.instanceColor.needsUpdate = true
  })

  return (
    <group scale={scale}>
      {/* frustumCulled=false: an InstancedMesh's default bounding sphere is
          computed from its geometry alone (a single ~1.4-unit-radius
          circle at the local origin), not from where each instance's
          matrix actually places it. Without this, three.js could cull the
          entire wordmark as "off-screen" based on that tiny, wrong bounding
          sphere. The instance count here (low thousands) makes disabling
          frustum culling entirely cheaper than keeping a correct bounding
          sphere in sync every frame. */}
      <instancedMesh ref={ceeDevMeshRef} args={[undefined, undefined, ceeDev.particles.length]} frustumCulled={false}>
        <circleGeometry args={[DOT_RADIUS, DOT_SEGMENTS]} />
        <meshBasicMaterial toneMapped={false} transparent />
      </instancedMesh>
      <instancedMesh ref={nameMeshRef} args={[undefined, undefined, name.particles.length]} frustumCulled={false}>
        <circleGeometry args={[DOT_RADIUS, DOT_SEGMENTS]} />
        <meshBasicMaterial toneMapped={false} transparent />
      </instancedMesh>
    </group>
  )
}
```

- [ ] **Step 2: Run the full suite**

Run: `npm test`
Expected: PASS (this file has no unit tests; this confirms nothing else regressed and the project still type-checks/builds via Vitest's Vite pipeline)

- [ ] **Step 3: Commit**

```bash
git add components/home/ParticleText.tsx
git commit -m "feat: rewrite ParticleText as two instanced contribution-grid circles

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: `HomeIntro.tsx` + `app/page.tsx` — fade-and-replace, keyboard, layout

**Files:**
- Modify: `components/home/HomeIntro.tsx` (full rewrite)
- Modify: `app/page.tsx`
- Modify: `app/page.test.tsx`
- Modify: `components/home/HomeIntro.test.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` (Task 5), `useMediaQuery` (Task 5), `ONE_LINER_RANGES` / `UNREACHABLE_RANGE` / `CTA_RANGE` / `SCROLL_PAGES` from `./scrollTimeline` (Task 4), `fadeOpacity` (existing), `homeOneLiners` / `homeWordmarkName` from `@/data/content` (Task 4), `ParticleText` (Task 7).
- Produces: `HomeIntro()` — same export shape as today.

- [ ] **Step 1: Replace the full contents of `components/home/HomeIntro.tsx`**

```tsx
// components/home/HomeIntro.tsx
'use client'

import { Suspense, useEffect, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'
import { ParticleText } from './ParticleText'
import { fadeOpacity } from './fadeOpacity'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useMediaQuery } from './useMediaQuery'
import { homeOneLiners, homeWordmarkName } from '@/data/content'
import { FADE_EDGE, ONE_LINER_RANGES, UNREACHABLE_RANGE, CTA_RANGE, SCROLL_PAGES } from './scrollTimeline'

const CTA_LABEL = 'View My Work'
const CTA_HREF = '/about'
const NARROW_VIEWPORT_QUERY = '(max-width: 639px)'

function StaticIntro() {
  return (
    <section className="flex min-h-full w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-5xl font-bold text-emerald-400">CeeDev</h1>
      <p className="text-2xl font-bold text-emerald-200">{homeWordmarkName}</p>
      <div className="flex flex-col gap-2">
        {homeOneLiners.map((line) => (
          <p key={line} className="text-xl font-bold text-slate-200">
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

// Runs inside <ScrollControls>, where useScroll() is available. It mirrors
// the live scroll offset into a plain ref every frame (read outside the
// Canvas via requestAnimationFrame, rather than drei's <Scroll html> — see
// the 2026-09-18 design's root-cause note on why that component was
// removed) and, once, makes the scroll element itself keyboard-operable.
// It must do the latter here: `scroll.el` is a plain DOM node, but only
// this component (a descendant of <ScrollControls>) has it via useScroll().
function ScrollOffsetBridge({ offsetRef }: { offsetRef: { current: number } }) {
  const scroll = useScroll()

  useEffect(() => {
    // The document itself no longer scrolls on the animated path (see
    // app/page.tsx), and the CTA is inert until it's visible, so drei's own
    // scroll element is the only thing left that keyboard users can reach
    // to drive the animation. It has no tabIndex by default.
    scroll.el.tabIndex = 0
    scroll.el.setAttribute('aria-label', 'Scroll to reveal introduction')
    scroll.el.classList.add('focus:outline-2', 'focus:outline-emerald-400', 'focus:outline-offset-[-2px]')
  }, [scroll.el])

  useFrame(() => {
    offsetRef.current = scroll.offset
  })
  return null
}

function FadingLine({
  offsetRef,
  range,
  hideWhenInvisible,
  children,
}: {
  offsetRef: { current: number }
  range: [number, number]
  hideWhenInvisible?: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frameId: number
    const tick = () => {
      if (ref.current) {
        const opacity = fadeOpacity(offsetRef.current, range[0], range[1], FADE_EDGE)
        ref.current.style.opacity = String(opacity)
        // The CTA link is interactive: while invisible it must not be
        // clickable, focusable, or able to swallow wheel/scroll input.
        // opacity:0 alone hides it visually but leaves all of that intact.
        // The sentences don't get this — they are pointer-events-none and
        // not focusable, and should stay in the accessibility tree at
        // every scroll position.
        if (hideWhenInvisible) {
          ref.current.style.visibility = opacity > 0 ? 'visible' : 'hidden'
        }
      }
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [offsetRef, range, hideWhenInvisible])

  return (
    <div
      ref={ref}
      className="absolute inset-x-0 flex justify-center"
      style={{ opacity: 0, visibility: hideWhenInvisible ? 'hidden' : undefined }}
    >
      {children}
    </div>
  )
}

function ScrollOverlay({ offsetRef }: { offsetRef: { current: number } }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
      <div className="relative flex w-full max-w-5xl items-center justify-center">
        {homeOneLiners.map((line, index) => (
          <FadingLine key={line} offsetRef={offsetRef} range={ONE_LINER_RANGES[index] ?? UNREACHABLE_RANGE}>
            <p className="text-balance text-center text-5xl leading-tight font-bold text-slate-100">{line}</p>
          </FadingLine>
        ))}
      </div>
      <FadingLine offsetRef={offsetRef} range={CTA_RANGE} hideWhenInvisible>
        <a
          href={CTA_HREF}
          className="pointer-events-auto rounded-md bg-[linear-gradient(90deg,#0f766e,#15803d)] px-5 py-3 text-white transition hover:brightness-110"
        >
          {CTA_LABEL}
        </a>
      </FadingLine>
    </div>
  )
}

export function HomeIntro() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isNarrowViewport = useMediaQuery(NARROW_VIEWPORT_QUERY)
  const showStatic = prefersReducedMotion || isNarrowViewport
  const offsetRef = useRef(0)

  // Nudge react-use-measure (used internally by Canvas for sizing) to
  // re-measure shortly after mount. Canvas is loaded via a client-only
  // dynamic import, which can resolve and mount before its container's
  // final layout size is committed; the first ResizeObserver callback can
  // then report the browser's default 300x150 canvas size and never fire
  // again on its own. This must key on the SAME condition that decides
  // whether the Canvas renders at all: crossing the narrow-viewport
  // breakpoint upward (e.g. rotating a phone from portrait to landscape)
  // now also mounts a fresh Canvas, and without this effect re-running for
  // that case too, that path reproduces the same 300x150 bug.
  useEffect(() => {
    if (showStatic) return
    const id = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    return () => window.clearTimeout(id)
  }, [showStatic])

  if (showStatic) {
    return <StaticIntro />
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Neither "CeeDev" nor the name exist as real text on the canvas
          path — they're pixels sampled onto instanced WebGL circles. This
          is their screen-reader-accessible equivalent, matching
          StaticIntro's visible <h1> + name. The name is a SIBLING of the
          h1, never nested inside it: nesting it would change the heading's
          accessible name to "CeeDev Carl John Caber" and break the two
          tests (here and in app/page.test.tsx) that match it exactly. */}
      <h1 className="sr-only">CeeDev</h1>
      <p className="sr-only">{homeWordmarkName}</p>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ScrollControls pages={SCROLL_PAGES} damping={0.2}>
          <Suspense fallback={null}>
            <ParticleText />
          </Suspense>
          <ScrollOffsetBridge offsetRef={offsetRef} />
        </ScrollControls>
      </Canvas>
      <ScrollOverlay offsetRef={offsetRef} />
    </div>
  )
}
```

- [ ] **Step 2: Replace the full contents of `app/page.tsx`**

```tsx
// app/page.tsx
import { Nav } from '@/components/Nav'
import { HomeIntroLoader } from '@/components/home/HomeIntroLoader'

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Nav />
      <div className="min-h-0 flex-1">
        <HomeIntroLoader />
      </div>
    </div>
  )
}
```

(No `overflow-hidden` needed on this outer wrapper: it has no explicit height beyond `min-h-dvh`, so it always sizes to fit its content — `Nav` plus whichever intro is rendered — and there is nothing for `overflow-hidden` to clip here. The `overflow-hidden` that actually matters lives on `HomeIntro`'s own animated-path root, from Step 1, which is the one whose height is fixed via `h-full` rather than intrinsic.)

- [ ] **Step 3: Update `app/page.test.tsx`'s `matchMedia` mock to be query-aware, and add a name assertion**

Read the current file first. Replace its full contents:

```tsx
// app/page.test.tsx
import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'
import { ThemeProvider } from '@/components/ThemeProvider'
import { homeWordmarkName } from '@/data/content'

const originalMatchMedia = window.matchMedia

beforeEach(() => {
  // Query-aware: '(prefers-reduced-motion: reduce)' must match so this
  // test exercises StaticIntro (the only branch jsdom can render — the
  // Canvas branch needs a real WebGL context). Any other query (notably
  // the '(max-width: 639px)' narrow-viewport check) defaults to false so
  // the two conditions stay independently controllable.
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
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
  expect(
    await screen.findByRole('heading', { level: 1, name: 'CeeDev' }, { timeout: 5000 })
  ).toBeInTheDocument()
  expect(screen.getByText(homeWordmarkName)).toBeInTheDocument()
  expect(
    await screen.findByRole('link', { name: 'View My Work' }, { timeout: 5000 })
  ).toBeInTheDocument()
})
```

- [ ] **Step 4: Update `components/home/HomeIntro.test.tsx`'s `matchMedia` mock and add a name assertion**

Read the current file first. Replace its full contents:

```tsx
// components/home/HomeIntro.test.tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomeIntro } from './HomeIntro'
import { homeOneLiners, homeWordmarkName } from '@/data/content'

describe('HomeIntro', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    // Query-aware for the same reason as app/page.test.tsx: only
    // '(prefers-reduced-motion: reduce)' matches, so this test exercises
    // StaticIntro, the one branch renderable under jsdom.
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('renders the static reduced-motion intro with the heading, the name, every one-liner, and the CTA', () => {
    render(<HomeIntro />)
    expect(screen.getByRole('heading', { level: 1, name: 'CeeDev' })).toBeInTheDocument()
    expect(screen.getByText(homeWordmarkName)).toBeInTheDocument()
    homeOneLiners.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument()
    })
    expect(screen.getByRole('link', { name: 'View My Work' })).toHaveAttribute('href', '/about')
  })
})
```

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: PASS — including both updated test files and every earlier task's tests

- [ ] **Step 6: Commit**

```bash
git add components/home/HomeIntro.tsx components/home/HomeIntro.test.tsx app/page.tsx app/page.test.tsx
git commit -m "feat: fade-and-replace wordmark, bigger sentences, keyboard support

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: Manual verification (browser)

This feature's core rendering is WebGL inside a client-only dynamic import — untestable under jsdom by this codebase's established convention (see `HomeIntro.test.tsx`'s and the spec's own notes). Every check below is real-browser, using the project's preview tooling. Do not skip this task or treat Task 8's green test suite as sufficient on its own — the scatter-radius regression on the previous iteration of this feature was invisible to every DOM/opacity-based check and only showed up in a screenshot.

- [ ] **Step 1: Start the dev server and open the Home page**

Start the `dev` preview and navigate to `/`. Confirm no console errors on initial load.

- [ ] **Step 2: First frame (offset 0)**

Screenshot at load, no scroll. Confirm: "CeeDev" is fully formed and legible; "Carl John Caber" is scattered (not yet assembled); no sentence or CTA is visible; visible clearance below the sticky nav.

- [ ] **Step 3: Drive the scroll element directly to specific offsets**

`ScrollControls` damps its offset toward the target (damping 0.2), so after setting scroll position, wait roughly a second for it to settle before screenshotting — a capture taken immediately will show a lagging, incorrect frame.

For each offset below, set the scroll element's `scrollTop` to `offset * (scrollHeight - clientHeight)` (read both from the element `useScroll().el` renders — it's the only scrollable element on the animated path), wait, then screenshot:

- **0.22** — both lines fully formed, full opacity.
- **0.29** — wordmark mid-fade, no sentence visible yet.
- **0.44** — sentence 1 alone, legible at 48px bold, nothing else on screen.
- **0.66** — sentence 2 alone, same check.
- **1.0** — sentence 3 with the CTA below it, not overlapping either the sentence slot or each other.

- [ ] **Step 4: Widths**

At 1280px, 768px, and 640px: neither line overflows, with visible clearance below the sticky nav. At 640px specifically (the worst case for the canvas path — immediately above the breakpoint, smallest dots), check most carefully. At 640px, also confirm no sentence wraps beyond two lines and none touches the viewport edge; if the ~900px sentence-width estimate in the spec is off, note the measured width.

- [ ] **Step 5: Below the breakpoint**

Resize to below 640px width. Confirm the static text layout renders (no canvas mounted — check there's no `<canvas>` element in the DOM) and it scrolls normally if its content exceeds the viewport height.

- [ ] **Step 6: Document scroll on the animated path**

At a width above 640px, confirm the outer document does not scroll — its scroll height should equal the viewport height, with only `useScroll().el` scrolling internally.

- [ ] **Step 7: Rotation-equivalent resize**

Resize in one step from 500px wide to 1024px wide (simulating a phone rotating past the breakpoint while mounted). Confirm the canvas mounts at full size, not stuck at 300×150.

- [ ] **Step 8: Keyboard**

From a fresh load, press Tab. Confirm focus reaches the scroll element with a visible focus outline. With it focused, press Arrow Down / Page Down / Space and confirm the animation advances through each handoff to the end state, where Tab then reaches the CTA link.

Also, at offset 0 (CTA not yet visible): confirm Tab does not land on the CTA, and clicking where the CTA will later appear does not navigate.

- [ ] **Step 9: Colour**

At offset 0 (wordmark fully visible), zoom into the wordmark and sample the centres of about ten individual dots. At least seven of the ten should match one of the four ramp colours (`#15503a`, `#05734f`, `#0f9e6b`, `#2cc98c`) within about ±3 per channel — the remainder may be mid-shimmer-glide between two levels. If most or all dots look washed out or shifted (a strong sign `toneMapped={false}` didn't take effect, or R3F's ACES tone mapping is otherwise active), stop and fix `ParticleText.tsx` before continuing.

- [ ] **Step 10: Shimmer**

Watch the wordmark at offset 0 for about 30 seconds. Dots should glide smoothly between neighbouring greens over roughly a second and a half each; none should blink or snap instantly, and no visible cluster of dots should brighten in unison.

- [ ] **Step 11: Instance count**

Temporarily log `ceeDev.particles.length + name.particles.length` from `ParticleText.tsx` (e.g. a one-off `console.log` inside the component body, removed before committing) and confirm it lands in the low thousands, consistent with the spec's estimate. Remove the log afterward — do not commit it.

- [ ] **Step 12: Dark mode**

Confirm all of the above holds with the site's dark theme active (it is — the intro is designed against the dark gradient background; there is no separate light-mode treatment for this page).

- [ ] **Step 13: Record findings**

If any check in this task fails, fix the relevant file from Tasks 6–8, re-run `npm test`, and repeat this task's checks from Step 1. Do not proceed to Task 10 until every check passes.

No commit for this task — it's verification only. If fixes were needed, commit them against the task file they belong to, referencing this task in the message, e.g. `git commit -m "fix: correct ParticleText colour space bug found in manual verification"`.

---

### Task 10: Finish the branch

- [ ] **Step 1: Run the full test suite one last time**

Run: `npm test`
Expected: PASS, every file.

- [ ] **Step 2: Invoke the finishing-a-development-branch skill**

Follow it to decide how this branch (`feature/home-intro-contribution-grid`) gets merged, opened as a PR, or handed off — do not decide this unilaterally in this plan.

---

## Self-Review

**Spec coverage:** Layout/shared-origin (Task 7, `boundsOfPoints` centre), lattice/step 4 (Task 7 constants), colour ramp + colour space + tone mapping (Task 1 + Task 7's `SRGBColorSpace`/`toneMapped={false}`), no background lattice (Task 7 only rasterizes real glyphs), shimmer glide (Task 1), sentence typography (Task 8's `text-5xl font-bold` slot + `StaticIntro`'s `text-xl font-bold`), scroll timeline + handoff invariant (Task 4), CeeDev fixed / name assembles (Task 7), wordmark fade-out + inert CTA (Task 7's visibility skip + Task 8's `hideWhenInvisible`), responsive sizing / `fitScale` / 640px breakpoint (Tasks 3, 5, 8), overlay positioning (Task 8's `ScrollOverlay`), instanced rendering approach (Task 7), content data / `homeWordmarkName` (Task 4), module layout (matches File Structure above), accessibility (Task 8's sibling `<p className="sr-only">`, keyboard in `ScrollOffsetBridge`), nav-height layout fix (Task 8 Step 2), testing (Tasks 1–5 unit tests, Task 9 manual). All covered.

**Placeholder scan:** No TBD/TODO markers; every step has complete, runnable code; no "similar to Task N" references.

**Type consistency:** `Bounds` defined once in `particlePositions.ts` (Task 2), imported by `fitScale.ts` (Task 3) and used structurally (not re-declared) in `ParticleText.tsx` (Task 7). `Rgb` defined once in `contributionLevels.ts` (Task 1), used consistently by `rampAt`/`mixRgb`/`ParticleText.tsx`. `ScatteredParticle`/`Point2D` reused from `particlePositions.ts` throughout, never redefined. `ONE_LINER_RANGES`/`UNREACHABLE_RANGE`/`CTA_RANGE`/`WORDMARK_RANGE`/`NAME_ASSEMBLY_END`/`FADE_EDGE`/`SCROLL_PAGES` all defined once in `scrollTimeline.ts` (Task 4) and only ever imported elsewhere, never redeclared.
