# Home Page Three.js Intro — Design

**Date:** 2026-09-18
**Owner:** Carl John E. Caber

## Purpose

Add a new animated "Home" page that becomes the site's default landing
experience at `/`. It introduces the site with a Three.js particle-cloud
animation of "CeeDev" and a short sequence of scroll-triggered one-liners,
then hands off to the existing portfolio content (Hero through Contact),
which moves to a new `/about` route.

## Routing Changes

- `app/page.tsx` (currently the full one-page portfolio: Hero, About,
  Experience, Skills, Projects, Education, Contact) moves to
  `app/about/page.tsx` unchanged in content/behavior.
- A new `app/page.tsx` is created for the Home experience described below.
- `Nav`'s section links change from same-page anchors (`#about`,
  `#experience`, `#skills`, `#projects`, `#education`, `#contact`) to
  `/about#about`, `/about#experience`, etc. This works as an in-page scroll
  when already on `/about` (same-document hash navigation) and as a
  navigate-then-scroll when clicked from `/`.
- `Nav`'s brand link ("CeeDev") changes from `#hero` to `/` (home).
- `Nav` renders on both `/` and `/about` — it is already a shared
  component, so this is one change benefiting both pages, not a
  duplication.

## Home Page Experience

Single scrollable page, short (~3-4 screen-heights of scroll track),
respecting `prefers-reduced-motion`.

1. **Particle formation.** A Three.js particle cloud starts scattered
   across 3D space and gathers into the "CeeDev" wordmark as the user
   scrolls through the first portion of the scroll track. Particles are
   sampled from a canvas-rasterized rendering of the text (same technique
   validated in the visual companion mockup), each given a scattered
   start position with z-depth jitter, interpolated toward its target
   position by scroll progress.
2. **One-liners.** After the text forms, three short lines cross-fade in
   one at a time, each tied to its own scroll range:
   1. "Full-Stack Web Developer."
   2. "Building scalable web experiences."
   3. "From legacy IBM i to modern React."
3. **Call to action.** The final screen fades in a "View My Work" button
   linking to `/about`.
4. **Nav bar** is visible and interactive from the very first scroll
   position, so visitors are never forced to scroll through the animation
   to reach the rest of the site.

## Technical Approach

- **New dependencies:** `three`, `@react-three/fiber`, `@react-three/drei`.
- **`@react-three/fiber`** provides the declarative React/Three.js
  integration, consistent with this codebase's existing declarative style
  (Framer Motion is already used the same way).
- **`@react-three/drei`'s `ScrollControls`/`useScroll`** provides the
  scroll-driven rig (a `<Canvas>` whose contents respond to an overlaid
  scrollable HTML region), rather than hand-rolling scroll-position
  tracking and WebGL lifecycle management.
- **One-liners and the CTA render as HTML overlays** (via Framer Motion
  opacity cross-fades keyed to `useScroll().offset` ranges), not inside
  the WebGL canvas — keeps text crisp, selectable, and accessible.
- **Reduced motion:** when `prefers-reduced-motion: reduce` is set, skip
  the scroll-scrub animation entirely. Render a single static screen
  (no scroll-linked reveal, no particle motion) showing the already-formed
  "CeeDev" text, all three one-liners stacked underneath it, and the CTA
  button — everything visible at once, nothing gated behind scroll
  position.

## Component Structure

- `app/page.tsx` — assembles `Nav` + the Home scroll experience.
- `app/about/page.tsx` — the former `app/page.tsx` content, unchanged.
- `components/home/ParticleText.tsx` — the R3F `<Canvas>` and particle
  system; consumes scroll progress (from `useScroll`), produces the
  rendered 3D scene. No knowledge of one-liners or the CTA.
- `components/home/HomeIntro.tsx` — orchestrates `ScrollControls`, renders
  `ParticleText` inside the canvas, and renders the one-liner/CTA HTML
  overlays positioned by scroll progress. Owns the reduced-motion branch
  (renders a static, non-scroll-linked version when
  `prefers-reduced-motion` is set).
- `data/content.ts` — add `homeOneLiners: string[]` (the three lines
  above) and reuse existing `profile`/`summary` data where relevant; no
  changes to existing exports.
- `Nav.tsx` — modify link hrefs as described above.

## Non-Goals

- No changes to the content or behavior of the existing Hero-through-Contact
  sections beyond their move to `/about`.
- No audio, no additional 3D scenes beyond the "CeeDev" particle text.
- No CMS-driven or user-editable one-liners — they are static data, same
  pattern as the rest of the site's content.
