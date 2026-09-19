# Home Intro Contribution Grid — Design

**Date:** 2026-09-19
**Owner:** Carl John E. Caber
**Supersedes portions of:** `2026-09-18-home-page-threejs-intro-design.md`

## Purpose

Rework the Home page particle intro so that:

1. "CeeDev" is fully formed on the very first frame.
2. "Carl John Caber" renders below it at a smaller size, assembling from
   scattered particles as the visitor scrolls.
3. The particles read as a GitHub contribution graph rendered in circles
   rather than squares — discrete, grid-aligned dots at varying green
   intensities, some lit and some muted.
4. Once both lines have formed and held briefly, the wordmark fades out and
   is **replaced** by the one-liners, which are set much bigger and bolder
   than today.

The routing, the one-liner copy, the CTA target, and the reduced-motion
contract from the 2026-09-18 design all stand.

## What Changes From The Current Implementation

| Aspect | Current | New |
| --- | --- | --- |
| "CeeDev" | Scattered at offset 0, gathers by 0.4 | Formed at frame 1, fades out 0.26 → 0.32 |
| Second line | None | "Carl John Caber", assembles 0 → 0.20 |
| Dot shape | Square points, `sizeAttenuation` | True circles, uniform world size |
| Dot colour | One flat `#34d399` | Four-level emerald ramp, per dot |
| Dot motion | Position only | Position + intensity shimmer |
| One-liners | 18px regular, overlapping crossfades | 48px bold, clean handoffs, one at a time |
| Overlay | Centred over the particles | Replaces the wordmark; CTA sits below the final sentence |
| Scroll ranges | Split across two components | One `scrollTimeline` module, invariant under test |
| Composition scale | Fixed `WORLD_SCALE = 0.02` | Derived from content bounds + viewport, capped at 960px |
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
box**, not the canvas centre. Content spans roughly y = 42 (top of
"CeeDev") to y = 166 (bottom of the name's descender), so it sits 58px
above the canvas centre and 66px below it. Centring on (330, 100) would
hang the composition slightly low on screen and break `fitScale` (see
Responsive Sizing).

The required order of operations is therefore:

1. Rasterize each line into its own identically-sized canvas.
2. Sample each canvas with `sampleTextPoints` at the shared step.
3. Concatenate both point sets and take `boundsOfPoints` of the union.
4. Pass that bounding box's centre to `createScatteredParticles` for
   **both** lines, and the box itself to `fitScale`.

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
have holes punched in them rather than muted texture. At 2.00:1 the floor
is faint but present — which is the intent; the brighter levels carry
legibility. WCAG text minimums do not apply here: the accessible name is
carried by real text in the DOM (see Accessibility), not by the canvas.
These ratios are computed, not estimated; if the floor reads as holes
during verification, raise level 0 rather than re-deriving the ramp.

Level distribution is weighted 20 / 30 / 30 / 20 across levels 0–3, assigned
once at load from a position-seeded hash so the pattern is stable across
re-renders and not re-randomised on every mount.

#### Colour space

The ratios above are sRGB values, and they only hold if the ramp survives
three.js's colour pipeline intact. three.js applies output colour-space
conversion by default, so feeding raw hex into `instanceColor` without
going through colour management renders a visibly different green from
the one specified here.

The ramp is authored as sRGB hex and constructed with `new THREE.Color(hex)`
so that `THREE.ColorManagement` (enabled by default in current three.js)
performs the sRGB → working-space conversion. The renderer's output colour
space is left at its default rather than overridden. Verification checks
the rendered result against the ramp (see Testing).

### No background lattice

Dots exist **only where the letters rasterize**. There is no field of dim
cells surrounding the text. This keeps the instance count down and keeps
the composition reading as a wordmark rather than as a panel, at the cost
of looking somewhat more like a dot-matrix sign than a literal contribution
graph. The intensity variation carries the GitHub reference on its own.

### Shimmer

Lit dots drift between adjacent intensity levels on a staggered cycle, so
the first frame is not completely static even though "CeeDev" does not
move.

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

### Sentence typography

The one-liners replace the wordmark on screen rather than sharing it, so
they can be set as headlines:

- **Animated path:** `text-5xl font-bold` (48px, weight 700), `leading-tight`,
  `text-balance`, `max-w-4xl`, `text-slate-100`, centred. The longest
  sentences run roughly 900px at this size, so they sit on one line on a
  typical desktop and wrap to two below ~900px; `text-balance` splits a
  wrapped sentence into even halves rather than leaving a one-word orphan.
- **`StaticIntro`:** every element shares one screen there, so the
  sentences get the "bolder" half of the change but not the full size:
  `text-xl font-bold` (20px, up from 18px regular). At 48px, three stacked
  sentences would outrank both the name and the heading and break the
  hierarchy.

## Motion Specification

### Scroll timeline

All ranges live in one module, `scrollTimeline.ts`, because they now
interlock across two components: the wordmark fades in `ParticleText`
(inside the Canvas) and the sentences fade in `HomeIntro` (outside it). A
retune in one place that ignores the other is how handoffs start to
collide.

Every fade uses the existing `fadeOpacity(offset, from, to, edge)` with the
shared `FADE_EDGE = 0.06`. At `pages={4}`, one unit of offset is four
viewport-heights of scrolling.

| Element | Range `[from, to]` | Full opacity | Full opacity, viewport-heights |
| --- | --- | --- | --- |
| Wordmark ("CeeDev" + name) | `[-1, 0.32]` | 0 → 0.26 | 1.04 |
| Sentence 1 | `[0.34, 0.54]` | 0.40 → 0.48 | 0.32 |
| Sentence 2 | `[0.56, 0.76]` | 0.62 → 0.70 | 0.32 |
| Sentence 3 | `[0.78, 2]` | 0.84 → 1 | 0.64 |
| CTA | `[0.84, 2]` | 0.90 → 1 | 0.40 |

Name assembly (position, not opacity) runs over **0 → 0.20** — 0.80
viewport-heights of scroll. It then holds, fully formed alongside
"CeeDev", for a further 0.24 viewport-heights before the fade begins.

Out-of-reach bounds, deliberately:

- The wordmark's `from = -1` exists because `fadeOpacity` returns 0 for
  `offset <= from`. A `from` of 0 would render the wordmark invisible on
  the very first frame — the one frame it must be fully visible. With
  `from = -1` the fade-in edge ends at -0.94, out of reach, so offset 0
  sits on the plateau.
- Sentence 3 and the CTA use `to = 2` for the reason the CTA already does:
  `fadeOpacity` treats `to` as exclusive, so `to = 1` would fade them out
  at maximum scroll — the moment they must be on screen.

**The handoff invariant:** among the wordmark and the three sentences, at
most one has non-zero opacity at any offset. Each fade-out completes
before the next fade-in begins, leaving a 0.02 gap (0.08 viewport-heights)
between them — a deliberate beat, and what makes it a replacement rather
than a crossfade. This matters more than before: two 48px bold sentences
overlapping at partial opacity in the same spot read as illegible mush,
where two 18px lines were merely untidy. The invariant is enforced by test
(see Testing), not by comment.

**The end state** is sentence 3 with the CTA below it. The CTA is the only
element allowed to coexist with a sentence, and it is positioned apart from
it (see Overlay Positioning), so coexisting never means overlapping.

This was tuned by simulation rather than by eye. A first pass gave
sentences 1 and 2 only 0.16 viewport-heights at full opacity — too brief
for a headline — so the ranges were widened until each got 0.32, double
what it had.

Scrolling back up reverses everything: sentences fade out, the wordmark
fades back in, and the name disassembles. Nothing is one-way.

### "CeeDev" — fixed position

Instance **matrices** are written once on mount and never updated again;
the line never moves and is fully legible at scroll offset 0. Its
`instanceColor` buffer is still rewritten every frame by shimmer, so
"fixed" describes its position, not its per-frame cost.

### "Carl John Caber" — assembles on scroll

Reuses `createScatteredParticles` and `interpolateParticle` from
`particlePositions.ts` unchanged, driven by
`progress = clamp(offset / 0.20, 0, 1)`.

Each in-flight dot's colour is composed in a fixed order:

```
colour = mix(ramp[0], ramp[levelAt(base, phase, t)], progress)
```

Shimmer picks the *target* level first; that target is then mixed from the
level-0 floor by `progress`. So at launch (`progress = 0`) every dot is the
floor colour and shimmer has no visible effect, and at landing
(`progress = 1`) it is fully present. Shimmer's visible strength therefore
scales with progress, and assembly and lighting-up read as one gesture.
Reversing the order — mixing first, then applying shimmer's level step —
would let shimmer flicker dots mid-flight.

"CeeDev" uses the same expression with `progress` pinned at 1.

### Wordmark fade-out

Both instanced meshes share one opacity,
`fadeOpacity(offset, ...WORDMARK_RANGE, FADE_EDGE)`, applied through their
materials (`transparent: true`). It multiplies the per-dot colour above;
it does not replace it.

Once that opacity reaches 0, both meshes are set `visible = false` and the
per-frame colour and matrix loops are skipped entirely — for the remaining
~68% of the scroll track there is nothing to draw, so nothing should be
computed. Scrolling back past 0.32 re-enables them.

## Responsive Sizing

### The scale must derive from content bounds, not the canvas

`WORLD_SCALE` is currently hardcoded to `0.02`. Glyphs do not fill the
raster — `sampleTextPoints` only emits points where alpha clears the
threshold — so the canvas width is not the composition width. "CeeDev" at
96px spans roughly 317px of the current 480px canvas.

Two pure helpers compute the fit:

```
boundsOfPoints(points) -> { minX, maxX, minY, maxY, width, height, centerX, centerY } | null
fitScale(bounds, viewport, options) -> number
```

`boundsOfPoints` returns the derived `width` / `height` / `centerX` /
`centerY` alongside the raw extremes, so the same value feeds both
`createScatteredParticles` (which needs the centre) and `fitScale` (which
needs the size) without the caller re-deriving either.

Because the wordmark and the sentences never share the screen (see the
handoff invariant), the wordmark fits against the **full viewport**. The
55 / 45 viewport split in the previous revision of this document existed
only to keep a permanently visible wordmark clear of the overlay; with a
clean handoff it has nothing left to prevent, and is removed.

`fitScale` returns:

```
min(
  viewport.width  * (1 - margin) / bounds.width,
  viewport.height * (1 - margin) / bounds.height,
  maxWidth / bounds.width
)
```

with **`margin = 0.2`** — the wordmark occupies at most 80% of either
viewport dimension — and **`maxWidth`** equal to 960 CSS pixels expressed in
world units (`960 * viewport.width / canvasWidthPx`).

Both viewport axes are constrained. The composition is roughly 2.8:1, so
width normally binds — but on short, wide viewports height binds instead,
and fitting by width alone would overflow vertically.

The 960px cap is new in this revision. Fitting to 80% of the viewport alone
makes a 1920px screen render a 1536px-wide wordmark — oversized to the
point of reading as a background pattern rather than a name. Computed with
the estimated bounds:

| Viewport | Composition width | Binds on | Dot diameter |
| --- | --- | --- | --- |
| 1920 × 1080 | 960px | cap | 7.5px |
| 1280 × 800 | 960px | cap | 7.5px |
| 768 × 1024 | 614px | width | 4.8px |
| 640 × 800 | 512px | width | 4.0px |

These rest on estimated bounds of ~347 × 124 raster px; the implementation
logs the measured bounds and the table should hold within a few percent.

Three properties this relies on:

- **Not `rasterWidth`.** Fitting the 660px canvas instead of the measured
  bounds would size the wordmark against mostly-empty canvas and render it
  at roughly half its intended size inside large margins.
- **`bounds.height` is valid only because the centre is the content
  centre.** `height` is `maxY - minY`, the extent needed around the
  composition's own centre. Centred on the canvas centre instead, the
  content would reach 66 units from the origin while the formula reserved
  62 — overflowing by ~6.5%, masked by the margin rather than prevented.
- **Degenerate bounds have a defined result.** `boundsOfPoints([])` returns
  `null`, and `ParticleText` renders nothing for a line set that produced
  no points: a blank raster — a font that failed to load, say — should mean
  a missing wordmark, not a crash. In `fitScale`, an axis with zero extent
  imposes no constraint, and that includes the cap, which is itself a
  width constraint. A single row (zero height) is therefore fitted by the
  width terms alone. A single point constrains nothing at all, so
  `fitScale` falls back to the 1:1 mapping — one raster pixel to one CSS
  pixel, `viewport.width / canvasWidthPx`. `fitScale` never divides by
  zero and never returns `Infinity` or `NaN`.

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
On a 375px phone the dots would fall to roughly 2.4px across — they alias
badly and the smaller line mushes. Step 4 solves legibility at desktop
widths only.

Below a 640px viewport width the Home page therefore renders the
`StaticIntro` layout — real DOM text, no `<Canvas>` — exactly as the
`prefers-reduced-motion` path already does. Phones get crisp text at any
size and skip the WebGL cost entirely, and no new layout is introduced.

This makes `StaticIntro` the shared fallback for two conditions, so the
branch in `HomeIntro` becomes "reduced motion **or** narrow viewport"
rather than reduced motion alone. `StaticIntro` shows everything at once;
the fade-and-replace sequence exists only on the animated path.

## Overlay Positioning

Today `ScrollOverlay` stacks every `FadingLine` at the same centred
position, which produces two collisions: the one-liners fade in on top of
the particles, and sentence 3 (`[0.7, 0.88]`) overlaps the CTA
(`[0.85, 2]`) between offsets 0.85 and 0.88, the button rendering over the
sentence.

The new layout resolves both:

- **The wordmark and the sentences share the centre of the viewport, but
  never at the same time.** The handoff invariant makes the first
  collision impossible by timing rather than by position.
- **The sentences share one slot**, centred in the viewport, reserving two
  lines' height at 48px `leading-tight` so a wrapped sentence never grows
  past it.
- **The CTA sits below that slot, never inside it.** Sentence 3 and the CTA
  are meant to coexist in the end state, so they are separated in space.

`Nav` is `sticky top-0` and sits in normal flow above the `h-dvh` intro, so
the canvas already begins below it. Clearance comes from the 20% margin in
`fitScale`. Verification confirms the gap at 1280px, 768px and 640px
rather than assuming the sticky header is accounted for.

## Rendering Approach

**`<instancedMesh>` with `CircleGeometry` and per-instance colour.**

Two instanced meshes, one per line, so the fixed line can skip matrix
updates entirely while the assembling line updates per frame. Both share
the wordmark's fade opacity.

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
anything. The implementation logs the actual count during verification to
confirm the estimate rather than assume it.

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
the site's copy, rather than hardcoded in a component, and how the name
appears elsewhere is unchanged.

The comment above `homeOneLiners` currently says to keep it the same length
as `ONE_LINER_RANGES` in `HomeIntro.tsx`. The ranges move to
`scrollTimeline.ts`, and the length coupling becomes a test, so the comment
is updated to point at both.

## Module Layout

New:

- `components/home/scrollTimeline.ts` — pure constants: `FADE_EDGE`,
  `WORDMARK_RANGE`, `NAME_ASSEMBLY_END`, `ONE_LINER_RANGES`,
  `UNREACHABLE_RANGE`, `CTA_RANGE`. The only place scroll ranges are
  defined.
- `components/home/contributionLevels.ts` — pure. Position-seeded level
  assignment, phase assignment, and `levelAt(baseLevel, phase, time)`.
  Holds the four-colour ramp as the single source of truth.
- `components/home/fitScale.ts` — pure. Viewport-fitting world scale with
  margin, both-axis constraint, width cap, and degenerate-axis handling.
- `components/home/useMediaQuery.ts` — see below.

Changed:

- `components/home/rasterizeText.ts` — gains a `y` option. Currently the
  vertical centre is hardcoded to `height / 2`; both lines need explicit
  placement within a shared canvas. Omitting `y` preserves current
  behaviour.
- `components/home/particlePositions.ts` — gains `boundsOfPoints`, which
  returns `{ minX, maxX, minY, maxY, width, height, centerX, centerY }`
  over the two lines' combined points, or `null` for an empty set. Its
  centre feeds `createScatteredParticles`; the box feeds `fitScale`.
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
  meshes, the level ramp, shimmer, derived scale, and the shared wordmark
  fade.
- `components/home/HomeIntro.tsx` — imports its ranges from
  `scrollTimeline.ts` instead of defining them; sentences move to the
  shared centred slot at 48px bold; the CTA moves below the slot; branch
  condition becomes reduced-motion **or** narrow viewport; `StaticIntro`
  and the `sr-only` block gain the name, and `StaticIntro`'s sentences go
  bold.
- `data/content.ts` — adds `homeWordmarkName`; updates the length-coupling
  comment on `homeOneLiners`.

Unchanged:

- `components/home/fadeOpacity.ts` — reused as-is for the wordmark fade;
  the out-of-reach `from = -1` works with its existing semantics, so it
  needs no new mode or parameter.
- `components/home/HomeIntroLoader.tsx`.

## Accessibility And Reduced Motion

- The `sr-only` block becomes the `h1` "CeeDev" **plus a sibling element**
  carrying the name. The name must **not** be nested inside the `h1`: that
  would change the heading's accessible name to "CeeDev Carl John Caber"
  and break the two existing tests that match it exactly (see Testing).
- The one-liners remain real DOM text at every size, so the typography
  change has no effect on what assistive technology reads.
- `StaticIntro` gains "Carl John Caber" below the heading at `text-2xl` —
  half the heading's `text-5xl`, mirroring the 50% ratio on the canvas —
  fully formed, no canvas. It serves both the reduced-motion and the
  sub-640px paths.

## Testing

Unit tests, per the existing convention that WebGL and Canvas 2D code is
not testable in this jsdom environment and is verified by screenshot
instead.

**New**

- `scrollTimeline.ts`:
  - The handoff invariant — sampling offset 0 → 1 in steps of 0.001, at
    most one of wordmark / sentence 1 / 2 / 3 has non-zero opacity at any
    sample. This is the test that catches a future retune reintroducing
    overlap.
  - The wordmark has opacity 1 at offset 0.
  - Sentence 3 and the CTA both have opacity 1 at offset 1.
  - `ONE_LINER_RANGES.length === homeOneLiners.length` — replacing the
    comment-only coupling with an enforced one.
- `contributionLevels.ts` — level assignment is deterministic for a given
  position; distribution roughly matches the 20/30/30/20 weighting;
  `levelAt` never returns outside 0..3 for any base, phase or time,
  including at the clamping edges (base 0 stepping down, base 3 stepping
  up).
- `fitScale.ts` — fits within the margin; width binds on a typical
  landscape viewport; height binds on a short, wide one; the 960px cap
  binds on a large screen; a zero-height box (single row) is constrained by
  the width terms alone; a single point returns the 1:1 fallback; never
  returns `Infinity` or `NaN`.
- `particlePositions.ts` — `boundsOfPoints` over known point sets;
  `centerX` / `centerY` land at the true centre of an asymmetric set, which
  the shared-origin rule depends on; a single point yields zero width and
  height; an empty array yields `null`.
- `useMediaQuery.ts` — returns the initial match synchronously on first
  render (the regression guard for the lazy-initializer bug); responds to
  change events; **returns independent results for two different
  queries**, which is what makes the reduced-motion and breakpoint
  conditions separable.

**Updated**

- `app/page.test.tsx:29` and `components/home/HomeIntro.test.tsx:24` both
  assert `heading, level 1, name: 'CeeDev'` as an exact match. **That
  assertion must survive the change verbatim** — it is the check that the
  name was added as a sibling rather than nested inside the `h1`. Each file
  then gains a separate new assertion that the name itself renders.
- Both files mock `matchMedia` with `matches: true` for *every* query
  (`app/page.test.tsx:9`, `components/home/HomeIntro.test.tsx:10`). Once
  `useMediaQuery` serves both `prefers-reduced-motion` and
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

At scroll offsets set directly, not by eye:

- **0** — "CeeDev" fully formed and legible with no scroll; the name
  scattered.
- **0.22** — both lines formed, full opacity.
- **0.29** — wordmark mid-fade, no sentence visible.
- **0.44** and **0.66** — sentences 1 and 2 alone, legible at 48px bold,
  nothing else on screen.
- **1** — sentence 3 with the CTA below it, not overlapping.

At widths:

- Neither line overflows at 1280px, 768px or **640px**, with visible
  clearance below the sticky nav. 640px is the worst case for the canvas
  path — immediately above the breakpoint, where dots are smallest
  (~4.0px) — so it is the width most likely to fail.
- No sentence wraps beyond two lines at 640px.
- Below 640px, the static text layout renders and no canvas is mounted.

Colour, instance count, errors:

- **Colour.** At offset 0 (wordmark opacity 1), a pixel at a dot's centre
  matches one of the four ramp colours within ±3 per channel. Sampling a
  dot centre avoids antialiased edges, and matching *any* of the four
  accounts for shimmer changing the level. R3F's WebGL context does not
  preserve its drawing buffer, so `toDataURL` / `readPixels` from outside
  the render loop return blank; the check temporarily sets
  `gl={{ preserveDrawingBuffer: true }}` on the Canvas, reads the pixel,
  and the flag is reverted before commit.
- Logged instance count and measured bounds are within a few percent of
  the estimates in Responsive Sizing.
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
