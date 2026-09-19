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
| Second line | None | "Carl John Caber", assembles 0 → 0.4 |
| Dot shape | Square points, `sizeAttenuation` | True circles, uniform world size |
| Dot colour | One flat `#34d399` | Four-level emerald ramp, per dot |
| Dot motion | Position only | Position + intensity shimmer |
| Overlay | Centred over the particles | Below the particle block |
| Composition width | Fixed `WORLD_SCALE = 0.02` | Derived from viewport width |

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
literal greens so the intro does not clash with the Emerald Deep accent
used across the rest of the site:

| Level | Hex | Role |
| --- | --- | --- |
| 0 | `#15503a` | Muted floor |
| 1 | `#05734f` | |
| 2 | `#0f9e6b` | |
| 3 | `#2cc98c` | Brightest |

The floor is deliberately well above "invisible against the background."
Because there is no surrounding dim lattice (see below), a level-0 dot sits
*inside a letter* — if it reads as background, the glyphs look like they
have holes punched in them rather than muted texture.

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

### "CeeDev" — static

Instance matrices are written once on mount and never touched again. Only
its colours change, via shimmer. It is fully legible at scroll offset 0.

### "Carl John Caber" — assembles on scroll

Reuses `createScatteredParticles` and `interpolateParticle` from
`particlePositions.ts` unchanged. Gathers over scroll offset **0 → 0.4**,
the same range "CeeDev" previously used.

While a dot is in flight it renders at the level-0 floor colour and
brightens toward its assigned level as it lands — the colour is mixed by
the same `progress` value that drives position. Assembly and lighting-up
are therefore one gesture rather than two effects that happen to overlap.
Shimmer rides on top of the landed colour, so it is effectively invisible
mid-flight and fully present once seated.

### Scroll ranges (unchanged)

- Name assembly: 0 → 0.4
- One-liners: 0.4 → 0.88, three overlapping ranges
- CTA: 0.85 → 2 (upper bound beyond reach, per the existing fade-out fix)
- `ScrollControls pages={4}`

## Responsive Sizing

`WORLD_SCALE` is currently hardcoded to `0.02`. With the 480-wide raster
that already produces a composition ~9.6 world units wide against a visible
width of ~8.3 units at the current camera — which is why the wordmark was
observed overflowing narrow viewports. A 660-wide raster at the same
constant would be far worse.

The scale is therefore **derived**: a pure `fitScale(rasterWidth,
viewportWidth, marginFraction)` computes the world scale that fits the
composition within the R3F viewport width minus a margin. This is
recomputed on viewport change and fixes the known overflow bug as a side
effect rather than leaving it outstanding.

## Overlay Positioning

`ScrollOverlay` currently centres the one-liners and the CTA with
`items-center justify-center` — the same place the particle text occupies.
Today the one-liners already fade in on top of the particles; adding a
second line of wordmark makes the collision worse.

The overlay moves to sit **below** the particle block: the wordmark
occupies the upper portion of the viewport, the one-liners and CTA occupy
the lower portion. This is a layout change to `ScrollOverlay`'s container,
not a change to the fade logic, which stays as-is.

## Rendering Approach

**`<instancedMesh>` with `CircleGeometry` and per-instance colour.**

Two instanced meshes, one per line, so the static line can skip matrix
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

## Module Layout

New:

- `components/home/contributionLevels.ts` — pure. Position-seeded level
  assignment, phase assignment, and `levelAt(baseLevel, phase, time)`.
  Holds the four-colour ramp as the single source of truth.
- `components/home/fitScale.ts` — pure. Viewport-fitting world scale.

Changed:

- `components/home/rasterizeText.ts` — gains a `y` option. Currently the
  baseline midpoint is hardcoded to `height / 2`; both lines need explicit
  vertical placement within a shared canvas.
- `components/home/ParticleText.tsx` — rewritten around two instanced
  meshes, the level ramp, shimmer, and derived scale.
- `components/home/HomeIntro.tsx` — overlay repositioned below the
  wordmark; `StaticIntro` and the `sr-only` block gain the name.

Unchanged:

- `components/home/particlePositions.ts` — `sampleTextPoints` is already a
  lattice sampler; `createScatteredParticles` and `interpolateParticle`
  serve the assembling line as-is. No edits needed.
- `components/home/fadeOpacity.ts`, `usePrefersReducedMotion.ts`.

## Accessibility And Reduced Motion

- The `sr-only` block becomes the `h1` "CeeDev" plus the name, since
  neither exists as real text on the canvas path.
- `StaticIntro` (the `prefers-reduced-motion` branch) gains "Carl John
  Caber" below the heading at the smaller size, fully formed, no canvas —
  matching the animated path's end state.

## Testing

Unit tests, per the existing convention that WebGL and Canvas 2D code is
not testable in this jsdom environment and is verified by screenshot
instead:

- `contributionLevels.ts` — level assignment determinism for a given
  position; distribution roughly matches the 20/30/30/20 weighting;
  `levelAt` never returns outside 0..3 for any base, phase, or time,
  including at the clamping edges (base 0 stepping down, base 3 stepping
  up).
- `fitScale.ts` — fits within the margin; scales down for narrow
  viewports; behaves sanely at extreme aspect ratios.
- `rasterizeText.ts` — the new `y` option places glyphs where expected,
  and omitting it preserves the current centred behaviour.
- Existing `particlePositions` and `fadeOpacity` tests must continue to
  pass untouched.

Manual verification by screenshot, in a fresh browser tab:

- First frame shows "CeeDev" fully formed and legible with no scroll.
- "Carl John Caber" is legible once assembled.
- Neither line overflows at 1280px or at ~620px viewport width.
- One-liners and CTA do not overlap the wordmark.
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
