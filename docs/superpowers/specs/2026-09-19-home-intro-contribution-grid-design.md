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
| Overlay | Centred over the particles | Lower 45% of the viewport |
| Composition scale | Fixed `WORLD_SCALE = 0.02` | Derived from content bounds + allotted band |
| Viewport split | None — both centred, overlapping | Wordmark upper 55%, overlay lower 45% |
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
the same `centerX` / `centerY`.**

This is not an optimisation. If each line is centred on its own bounding
box — a natural reading of "sampled separately" — both lines resolve to
the origin and render on top of each other. The vertical offset between
the two lines exists only because they share a centre.

That shared centre is the **centre of the two lines' combined bounding
box**, not the canvas centre. The canvas centre would be wrong: content
spans roughly y = 42 (top of "CeeDev") to y = 166 (bottom of the name's
descender), so it sits 58px above the canvas centre and 66px below it.
Centring on (330, 100) would hang the composition slightly low on screen
and, worse, would break `fitScale` — see Responsive Sizing.

The required order of operations is therefore:

1. Rasterize each line into its own identically-sized canvas.
2. Sample each canvas with `sampleTextPoints` at the shared step.
3. Concatenate both point sets and take `boundsOfPoints` of the union.
4. Pass that bounding box's centre to `createScatteredParticles` for
   **both** lines, and its size to `fitScale`.

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

#### Colour space

The ratios above are sRGB values, and they only hold if the ramp survives
three.js's colour pipeline intact. three.js applies output colour-space
conversion by default, so feeding raw hex into `instanceColor` without
going through colour management renders a visibly different green than the
one specified here.

The ramp is authored as sRGB hex and constructed with `new THREE.Color(hex)`
so that `THREE.ColorManagement` (enabled by default in current three.js)
performs the sRGB → working-space conversion. The renderer's output colour
space is left at its default rather than overridden.

Verification samples a lit pixel off the canvas and compares it against the
authored hex. This is a cheap check that catches a whole class of
washed-out or oversaturated results, and without it the measured contrast
figures are an assumption rather than a fact.

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

**Threshold: 0.99.** A sine spends `(π − 2·asin(t)) / π` of its cycle
outside ±t, so with uniformly distributed phases that fraction is also the
proportion of dots deviating at any instant:

| Threshold | Dots deviating |
| --- | --- |
| 0.85 | 35.3% |
| 0.95 | 20.2% |
| 0.99 | 9.0% |
| 0.995 | 6.4% |

0.99 gives ~9% — a handful changing at a time, which is what makes the
effect ambient rather than a visible pulse. 0.85 would put over a third of
the wordmark in motion simultaneously and read as a wave.

`PERIOD` is on the order of 4 seconds and remains a taste-level tuning
knob. The threshold is not: if it is retuned, recompute the deviating
fraction from the formula above rather than guessing. The tests pin bounds
and determinism, not the specific values.

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

Two pure helpers compute the fit:

```
boundsOfPoints(points) -> { minX, maxX, minY, maxY, width, height, centerX, centerY }
fitScale(bounds, band, marginFraction) -> number
```

`boundsOfPoints` returns the derived `width` / `height` / `centerX` /
`centerY` alongside the raw extremes, so the same value feeds both
`createScatteredParticles` (which needs the centre) and `fitScale` (which
needs the size) without the caller re-deriving either.

`bounds` is over **both lines' sampled points combined**. `band` is the
region in world units at z = 0 that the wordmark is allotted — see below;
it is not the whole viewport. The result is:

```
min(
  band.width  * (1 - margin) / bounds.width,
  band.height * (1 - margin) / bounds.height
)
```

Both axes are constrained. The composition is roughly 3.3:1, so width
normally binds — but on short, wide viewports height binds instead, and
fitting by width alone would overflow vertically.

Two things this gets right that the obvious version does not:

- **Not `rasterWidth`.** Fitting the 660px canvas instead of the measured
  bounds would size the wordmark against mostly-empty canvas and render it
  at roughly half its intended size inside large margins.
- **`bounds.height` is only valid because the centre is the content
  centre.** `height` is `maxY - minY`, which describes the extent needed
  around the composition's own centre. If the lines were centred on the
  canvas centre instead (58px above the content, 66px below), the content
  would reach 66 units from the origin while the formula reserved 62 —
  overflowing by ~6.5%, masked by the margin rather than prevented.

### The wordmark and the overlay split the viewport

`fitScale` fits into a **band**, not the full viewport, because the
one-liners and CTA have to live somewhere.

The viewport is divided by construction: the wordmark gets the upper
**55%**, the overlay the lower **45%**. `fitScale` receives the band, so
the wordmark can never grow into the overlay at any viewport ratio.

Deriving the overlay's position from a static CSS offset while the
wordmark's on-screen size varies with the viewport would let the two
collide at some ratios. Splitting the space up front makes the collision
structurally impossible rather than something to check for.

The 55% band is also what provides clearance below the sticky nav: the
margin inside the band keeps the wordmark off both the nav above and the
overlay below.

### What the overflow bug actually was

The previously observed overflow was **not** caused by the composition
exceeding the visible width at desktop aspect ratios. At the current camera
(position `[0, 0, 5]`, fov 50) the visible height at z = 0 is
`2 * 5 * tan(25°)` ≈ 4.66 world units, giving ≈ 8.3 units of width at 16:9.
The old composition spans ≈ 317 × 0.02 ≈ 6.34 units, which fits.

It overflows on **narrow** viewports: at ~620 × 800 the aspect is ≈ 0.78,
so visible width falls to ≈ 3.6 units and 6.34 no longer fits. (The exact
figure depends on window height — at 620 × 740 it is ≈ 3.9 units. The
composition overflows either way.) Deriving the scale from viewport
dimensions fixes this at every aspect ratio.

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

The overlay moves to sit **below** the particle block, occupying the lower
45% of the viewport that the wordmark's band leaves free (see Responsive
Sizing). This is a layout change to `ScrollOverlay`'s container, not a
change to the fade logic, which stays as-is.

The 45% figure is not an independent constant — it is the complement of the
wordmark's band. Both must come from one shared value, so that changing the
split moves the boundary in both places at once. Defining them separately
is how they drift apart.

`Nav` is `sticky top-0` and sits in normal flow above the `h-dvh` intro, so
the canvas already begins below it. Clearance from the nav comes from the
margin inside the wordmark's band. Verification must confirm the gap at
1280px, 768px and 640px rather than assuming the sticky header is
accounted for.

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
- `components/home/particlePositions.ts` — gains `boundsOfPoints`, which
  returns `{ minX, maxX, minY, maxY, width, height, centerX, centerY }`
  over the two lines' combined points. Its centre feeds
  `createScatteredParticles`, its size feeds `fitScale`.
  `sampleTextPoints`, `createScatteredParticles` and `interpolateParticle`
  are unchanged.
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
  including a single point and an empty array; `centerX` / `centerY` land
  at the true centre of an asymmetric set, which is the property E1
  depends on.
- `useMediaQuery.ts` — returns the initial match synchronously on first
  render (the regression guard for the lazy-initializer bug); responds to
  change events; **returns independent results for two different queries**,
  which is what makes the reduced-motion and breakpoint conditions
  separable.

**Updated**

- `app/page.test.tsx:29` and `components/home/HomeIntro.test.tsx:24` both
  assert `heading, level 1, name: 'CeeDev'` as an exact match. **That
  assertion must survive the change verbatim** — it is the check that the
  name was added as a sibling rather than nested inside the `h1`. Each file
  then gains a separate new assertion that the name itself renders.
- Both files mock `matchMedia` with `matches: true` for *every* query
  ([page.test.tsx:9](../../../app/page.test.tsx), [HomeIntro.test.tsx:10](../../../components/home/HomeIntro.test.tsx)).
  Once `useMediaQuery` serves both `prefers-reduced-motion` and
  `max-width: 639px`, that blanket mock makes the two conditions
  indistinguishable. The mocks become **query-aware** — matching on the
  query string — so each condition can be set independently.
- `usePrefersReducedMotion.test.ts` must keep passing untouched across the
  `useMediaQuery` extraction.

**Explicitly not unit-tested**

The `HomeIntro` branch itself — "reduced motion or narrow viewport →
`StaticIntro`, otherwise `<Canvas>`" — cannot be tested at the component
level, because the Canvas branch throws under jsdom by design. Testing
`useMediaQuery` with two independent queries covers the part that is
testable; the branch is verified by screenshot at the widths listed below.
This is a deliberate limit, not an oversight.

**Unchanged**

- `fadeOpacity.test.ts`, and the existing `particlePositions.test.ts`
  cases.

**Manual verification by screenshot, in a fresh browser tab**

- First frame shows "CeeDev" fully formed and legible with no scroll.
- "Carl John Caber" is legible once assembled.
- Neither line overflows at 1280px, 768px or **640px**, with visible
  clearance below the sticky nav. 640px is the worst case for the particle
  path — immediately above the breakpoint, where dots are smallest
  (~4.5px) — so it is the width most likely to fail, not an afterthought.
- Below 640px, the static text layout renders and no canvas is mounted.
- One-liners and CTA do not overlap the wordmark at any tested width.
- A lit pixel sampled off the canvas matches the authored ramp hex
  (see Colour space).
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
