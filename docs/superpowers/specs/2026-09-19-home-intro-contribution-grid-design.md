# Home Intro Contribution Grid — Design

**Date:** 2026-09-19
**Owner:** Carl John E. Caber
**Supersedes portions of:** `2026-09-18-home-page-threejs-intro-design.md`

## Purpose

Rework the Home page particle intro so that:

1. "CeeDev" is fully formed on the very first frame and never moves.
2. "Carl John Caber" renders below it at a smaller size, assembling from
   scattered particles as the visitor scrolls.
3. The particles read as a GitHub contribution graph rendered in circles
   rather than squares — discrete, grid-aligned dots at varying green
   intensities, some lit and some muted.

The routing, the one-liner copy, the CTA, and the reduced-motion contract
from the 2026-09-18 design all stand. This document only changes how the
wordmark is built and animated.

## What Changes From The Current Implementation

| Aspect | Current | New |
| --- | --- | --- |
| "CeeDev" | Scattered at offset 0, gathers by 0.4 | Formed at frame 1, fixed forever |
| Second line | None | "Carl John Caber", assembles 0 → 0.25 |
| Dot shape | Square points, `sizeAttenuation` | True circles, uniform world size |
| Dot colour | One flat `#34d399` | Four-level emerald ramp, per dot |
| Dot motion | Position only | Position + intensity shimmer |
| Overlay | Centred over the particles | Below the particle block |
| Composition scale | Fixed `WORLD_SCALE = 0.02` | Derived from content bounds + viewport |
| Narrow viewports | Particle canvas at any width | Real text below 640px |

## Visual Specification

### Layout

Both lines are rasterized into canvases of **identical dimensions, sample
step, and origin**, then sampled separately. This is load-bearing: it
guarantees the two lines sit on one continuous lattice instead of two
grids that almost line up. Sampling one combined canvas and partitioning
by y-coordinate would also align them, but partitioning is fragile — two
passes over the same grid is not.

- Raster canvas: 660 × 200
- "CeeDev": bold 84px, horizontally centred, vertical centre at y = 72
  (`textBaseline = 'middle'`, as the current rasterizer already uses)
- "Carl John Caber": bold 42px (50% of CeeDev), horizontally centred,
  vertical centre at y = 145
- Gap between the glyph blocks: ~28px, i.e. **7 grid rows** at step 4

Spacing is specified in grid rows, not pixels, so it stays proportional if
the sizes are retuned.

#### Both lines share one world-space origin

`createScatteredParticles` converts raster coordinates to world space via
`point.x - centerX` and `centerY - point.y`. **Both lines must be passed
the same `centerX` / `centerY` — the shared canvas centre, (330, 100).**

This is not an optimisation. If each line is centred on its own bounding
box — a natural reading of "sampled separately" — both lines resolve to
the origin and render on top of each other. The vertical offset between
the two lines exists only because they share a centre.

### Lattice

- `SAMPLE_STEP = 4`
- Dot radius = `SAMPLE_STEP * 0.34` in raster units
- `ALPHA_THRESHOLD = 128` (unchanged)
- Circle geometry: 10 segments — ample at this on-screen size

Step 4 is the outcome of a real constraint, not a preference. A bold
glyph's stroke is roughly one seventh of its font size, so the 42px name
has ~6px strokes. At the step 8 that reads as a chunky contribution graph,
most strokes catch one dot or none and the letterforms never resolve. Step
4 is the coarsest lattice at which the smaller line stays legible. Chunky
dots and a small readable second line are mutually exclusive at this text
size; legibility wins.

### Colour

Four levels, drawn from the site's emerald family rather than GitHub's
literal greens, so the intro does not clash with the Emerald Deep accent
used across the rest of the site:

| Level | Hex | Contrast vs `#081126` | Role |
| --- | --- | --- | --- |
| 0 | `#15503a` | 2.00:1 | Muted floor |
| 1 | `#05734f` | 3.19:1 | |
| 2 | `#0f9e6b` | 5.47:1 | |
| 3 | `#2cc98c` | 8.80:1 | Brightest |

Because there is no surrounding dim lattice (see below), a level-0 dot sits
*inside a letter*. If it reads as background, the glyphs look like they
have holes punched in them rather than muted texture. At ~2.0:1 the floor
is faint but present — which is the intent, and the brighter levels carry
legibility. WCAG text minimums do not apply here: the accessible name is
carried by real text in the DOM (see Accessibility), not by the canvas.
These ratios are the measured design target; if the floor reads as holes
during verification, raise level 0 rather than re-deriving the ramp.

Level distribution is weighted 20 / 30 / 30 / 20 across levels 0–3, assigned
once at load from a position-seeded hash so the pattern is stable across
re-renders and not re-randomised on every mount.

### No background lattice

Dots exist **only where the letters rasterize**. There is no field of dim
cells surrounding the text. This keeps the instance count down and keeps
the composition reading as a wordmark rather than as a panel, at the cost
of looking somewhat more like a dot-matrix sign than a literal contribution
graph. The intensity variation carries the GitHub reference on its own.

### Shimmer

Lit dots drift between adjacent intensity levels on a staggered cycle, so
the first frame is not completely static now that "CeeDev" no longer moves.

Each dot carries a `phase` in [0, 1) from the same position seed. A pure
function drives the whole effect:

```
levelAt(baseLevel, phase, timeSeconds) -> 0..3
```

Implementation: `s = sin(2π * (time / PERIOD + phase))`; when `s` exceeds a
high threshold the dot steps one level up, when it falls below the negative
threshold it steps one level down, otherwise it holds at `baseLevel`. The
result is always clamped to 0..3.

The threshold is high (~0.85) on purpose — only a small fraction of dots
deviate at any instant, which is what makes the effect ambient rather than
a pulsing wave. `PERIOD` is on the order of 4 seconds. Exact tuning is an
implementation detail; the bounds and determinism are what the tests pin.

Shimmer updates `instanceColor` only. No geometry or matrix churn.

## Motion Specification

### "CeeDev" — fixed position

Instance **matrices** are written once on mount and never updated again;
the line never moves and is fully legible at scroll offset 0. Its
`instanceColor` buffer is still rewritten every frame by shimmer, so
"static" describes its position, not its per-frame cost.

### "Carl John Caber" — assembles on scroll

Reuses `createScatteredParticles` and `interpolateParticle` from
`particlePositions.ts` unchanged. Gathers over scroll offset **0 → 0.25**.

While a dot is in flight it renders at the level-0 floor colour and
brightens toward its assigned level as it lands — the colour is mixed by
the same `progress` value that drives position. Assembly and lighting-up
are therefore one gesture rather than two effects that happen to overlap.
Shimmer rides on top of the landed colour, so it is effectively invisible
mid-flight and fully present once seated.

### Scroll ranges

- Name assembly: **0 → 0.25** (was 0 → 0.4)
- One-liners: 0.4 → 0.88, three overlapping ranges (unchanged)
- CTA: 0.85 → 2 (unchanged; upper bound beyond reach, per the existing
  fade-out fix)
- `ScrollControls pages={4}` (unchanged)

Assembly lands at 0.25 rather than 0.4 so the name arrives without
demanding most of a viewport-height of scrolling first, leaving a
deliberate beat before the first one-liner at 0.4. `pages` stays at 4 so
one-liner and CTA pacing is untouched.

## Responsive Sizing

### The scale must derive from content bounds, not the canvas

`WORLD_SCALE` is currently hardcoded to `0.02`. Glyphs do not fill the
raster — `sampleTextPoints` only emits points where alpha clears the
threshold — so the canvas width is not the composition width. "CeeDev" at
96px spans roughly 317px of the current 480px canvas.

A pure helper computes the fit:

```
boundsOfPoints(points) -> { minX, maxX, minY, maxY }
fitScale(content, viewport, marginFraction) -> number
```

where `content` is the bounding box of **both lines' sampled points
combined**, `viewport` is the R3F viewport in world units at z = 0, and the
result is:

```
min(
  viewport.width  * (1 - margin) / content.width,
  viewport.height * (1 - margin) / content.height
)
```

Both axes are constrained. The composition is roughly 3.3:1, so width
normally binds — but on short, wide viewports height binds instead, and
fitting by width alone would overflow vertically.

Passing `rasterWidth` here instead of the measured bounds would fit 660
units of mostly-empty canvas and render the wordmark at roughly half its
intended size inside large margins.

### What the overflow bug actually was

The previously observed overflow was **not** caused by the composition
exceeding the visible width at desktop aspect ratios. At the current camera
(position `[0, 0, 5]`, fov 50) the visible height at z = 0 is
`2 * 5 * tan(25°)` ≈ 4.66 world units, giving ≈ 8.3 units of width at 16:9.
The old composition spans ≈ 317 × 0.02 ≈ 6.34 units, which fits.

It overflows on **narrow** viewports: at ~620px wide the aspect drops below
1, visible width falls to ≈ 3.6 units, and 6.34 no longer fits. Deriving
the scale from viewport dimensions fixes this at every aspect ratio.

### Below 640px: real text, no canvas

Uniform scaling preserves the dots-per-stroke ratio but not absolute size.
On a 375px phone the name scales to ~337px, putting dots at ~2.6px
diameter — they alias badly and the smaller line mushes. Step 4 solves
legibility at desktop widths only.

Below a 640px viewport width the Home page therefore renders the
`StaticIntro` layout — real DOM text, no `<Canvas>` — exactly as the
`prefers-reduced-motion` path already does. Phones get crisp text at any
size and skip the WebGL cost entirely, and no new layout is introduced.

This makes `StaticIntro` the shared fallback for two conditions, so the
branch in `HomeIntro` becomes "reduced motion **or** narrow viewport"
rather than reduced motion alone.

## Overlay Positioning

`ScrollOverlay` currently centres the one-liners and the CTA with
`items-center justify-center` — the same place the particle text occupies.
Today the one-liners already fade in on top of the particles; adding a
second line of wordmark makes the collision worse.

The overlay moves to sit **below** the particle block: the wordmark
occupies the upper portion of the viewport, the one-liners and CTA the
lower portion. This is a layout change to `ScrollOverlay`'s container, not
a change to the fade logic, which stays as-is.

`Nav` is `sticky top-0` and sits in normal flow above the `h-dvh` intro, so
the canvas already begins below it. The wordmark still needs deliberate
clearance rather than tucking against the nav bar: the `marginFraction` in
`fitScale` provides it, and verification must confirm the gap at both
1280px and 768px rather than assuming the sticky header is accounted for.

## Rendering Approach

**`<instancedMesh>` with `CircleGeometry` and per-instance colour.**

Two instanced meshes, one per line, so the fixed line can skip matrix
updates entirely while the assembling line updates per frame.

Alternatives considered:

- **Point cloud with a circular alpha map.** Cheapest — one draw call per
  line, and the existing code is already a point cloud. Rejected because
  point size is expressed in raw pixels, so it does not scale with viewport
  or camera, and some GPUs clamp maximum point size. Getting uniform,
  correctly-scaling circles out of it means shader work that instancing
  gives for free.
- **DOM/CSS grid for the static line, WebGL only for the assembling one.**
  Rejected outright: two rendering systems cannot share a lattice, so the
  two lines would drift out of alignment — the one thing this design is
  most careful to guarantee.

Instance count lands in the low thousands, far below where instancing costs
anything. The implementation should log the actual count once during
verification to confirm the estimate rather than assume it.

## Content Data

`profile.name` is `'Carl John E. Caber'` — with a middle initial the
wordmark should not carry, and three characters wider than needed on an
already width-constrained line. It also serves resume-accurate contexts
(Hero, Contact) that should keep it.

A new export is added to `data/content.ts` alongside `homeOneLiners`:

```ts
export const homeWordmarkName = 'Carl John Caber'
```

The wordmark string therefore lives in the content module with the rest of
the site's copy, rather than being hardcoded in a component — and without
altering how the name appears elsewhere.

## Module Layout

New:

- `components/home/contributionLevels.ts` — pure. Position-seeded level
  assignment, phase assignment, and `levelAt(baseLevel, phase, time)`.
  Holds the four-colour ramp as the single source of truth.
- `components/home/fitScale.ts` — pure. Viewport-fitting world scale,
  constrained on both axes.
- `components/home/useMediaQuery.ts` — see below.

Changed:

- `components/home/rasterizeText.ts` — gains a `y` option. Currently the
  vertical centre is hardcoded to `height / 2`; both lines need explicit
  placement within a shared canvas. Omitting `y` preserves current
  behaviour.
- `components/home/particlePositions.ts` — gains `boundsOfPoints`, the
  bounding box of sampled points, feeding `fitScale`. `sampleTextPoints`,
  `createScatteredParticles` and `interpolateParticle` are unchanged.
- `components/home/usePrefersReducedMotion.ts` — the narrow-viewport branch
  needs a second media query, and hand-rolling a parallel hook would
  duplicate this one's logic. Extract a generic `useMediaQuery(query)` and
  redefine `usePrefersReducedMotion` in terms of it.

  **The lazy `useState` initializer must be preserved in the extraction.**
  It is load-bearing: an initial value of `false` followed by an effect
  makes the first render take the Canvas branch, which throws
  synchronously under jsdom and risks a visible flash in production. This
  was a previously fixed bug and must not regress through the refactor.
- `components/home/ParticleText.tsx` — rewritten around two instanced
  meshes, the level ramp, shimmer, and derived scale.
- `components/home/HomeIntro.tsx` — overlay repositioned below the
  wordmark; branch condition becomes reduced-motion **or** narrow viewport;
  `StaticIntro` and the `sr-only` block gain the name.
- `data/content.ts` — adds `homeWordmarkName`.

Unchanged:

- `components/home/fadeOpacity.ts`, `components/home/HomeIntroLoader.tsx`.

## Accessibility And Reduced Motion

- The `sr-only` block becomes the `h1` "CeeDev" **plus a sibling element**
  carrying the name. The name must **not** be nested inside the `h1`: that
  would change the heading's accessible name to "CeeDev Carl John Caber"
  and break the two existing tests that match it exactly (see Testing).
- `StaticIntro` gains "Carl John Caber" below the heading at the smaller
  size, fully formed, no canvas — matching the animated path's end state.
  It now serves both the reduced-motion and the sub-640px paths.

## Testing

Unit tests, per the existing convention that WebGL and Canvas 2D code is
not testable in this jsdom environment and is verified by screenshot
instead:

**New**

- `contributionLevels.ts` — level assignment is deterministic for a given
  position; distribution roughly matches the 20/30/30/20 weighting;
  `levelAt` never returns outside 0..3 for any base, phase or time,
  including at the clamping edges (base 0 stepping down, base 3 stepping
  up).
- `fitScale.ts` — fits within the margin; scales down for narrow
  viewports; height binds on short wide viewports; sane at extreme aspect
  ratios.
- `particlePositions.ts` — `boundsOfPoints` over known point sets,
  including a single point and an empty array.
- `useMediaQuery.ts` — returns the initial match synchronously on first
  render (the regression guard for the lazy-initializer bug), and responds
  to change events.

**Updated**

- `app/page.test.tsx:29` and `components/home/HomeIntro.test.tsx:24` both
  assert `heading, level 1, name: 'CeeDev'` as an exact match. They must
  keep passing unchanged — which is the check that the name was added as a
  sibling rather than nested — and each gains an assertion that the name
  itself renders.
- `usePrefersReducedMotion.test.ts` must keep passing untouched across the
  `useMediaQuery` extraction.

**Unchanged**

- `fadeOpacity.test.ts`, and the existing `particlePositions.test.ts`
  cases.

**Manual verification by screenshot, in a fresh browser tab**

- First frame shows "CeeDev" fully formed and legible with no scroll.
- "Carl John Caber" is legible once assembled.
- Neither line overflows at 1280px or at 768px, with visible clearance
  below the sticky nav.
- Below 640px, the static text layout renders and no canvas is mounted.
- One-liners and CTA do not overlap the wordmark.
- Logged instance count is in the expected low thousands.
- No console errors.

Screenshots are mandatory here rather than DOM-state assertions. The
scatter-radius regression on the previous iteration was invisible to
opacity and canvas-existence checks and only showed up in a picture.

## Branching

This work branches from `feature/home-page-threejs-intro`'s tip rather than
from `master`. PR #3 merged, but two commits made after that merge —
the scatter-radius fix and the `createRoot` fix — never landed upstream.
Both touch files this rework rewrites, so splitting them into a separate PR
would put the rework in conflict with itself. They ride along on
`feature/home-intro-contribution-grid`.
