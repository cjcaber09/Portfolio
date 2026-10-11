---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["components/home/HomeIntro.tsx","components/home/ParticleText.tsx","components/home/contributionLevels.ts"]
---

# / surface brief

## Scope and mode

`/` only: `app/page.tsx`, the intro in `components/home/`, and the site header it shares with `/about`. Visitor mode: Experience. The artifact (the live CeeDev contribution-grid wordmark) leads, and the interface recedes around it.

## Audience, job, action, constraints

- Recruiters and hiring managers, often arriving here first from a link.
- Action: scroll the intro, then View My Work (to `/about`), or jump straight to a section from the header.
- Keep untouched (owner's requirement): the Three.js scene, the lattice and dot geometry, CeeDev formed on the first frame, the name assembling on scroll, the fade to one-liners, the slide-up, every scroll range, the copy, and the reduced-motion/narrow-screen static path. Only its colour, type, and chrome change.

## Direction contract

THESIS: `/` is the cover of the datasheet: the same sheet's world, with the contribution-grid wordmark living on it before the reader turns to `/about`. It refuses a second identity on one site: gradient headlines, a frosted glass header, a navy ground, and emoji controls.

OWN-WORLD: DESIGN.md's Component Datasheet: Archivo only, the `ds` tokens, one manufacturer green, the neutral night desk, the shared table-of-contents bar with its Dark mode switch, the solid green 2px-corner primary action, and the 16px stroked icon set. The wordmark's four contribution levels are four steps of that green (hue 165, chroma at most 0.1): pale to deep on the light desk, deep to bright on the night desk. No gradients, glass, shadows, or emoji.

STORY: The visitor sees CeeDev alive as a contribution grid, scrolls to assemble Carl John Caber, reads three one-liners set in the sheet's display cut, and takes View My Work into the datasheet, or takes the header straight to a section.

FIRST VIEWPORT: The shared sticky bar (CeeDev brand square, Home to Contact, Dark mode) on paper, with no section marked current on the cover. Below it, the dot-grid desk with the green contribution-grid CeeDev centred at its current size and timing, and the ink-3 scroll-hint mouse at bottom centre. Below 640px or under reduced motion: a static, left-aligned cover: CeeDev in the display cut after the brand square, the name, the three one-liners as ruled rows, and the primary action.

FORM: An extension of the established Component Datasheet world (DESIGN.md), with no new roll and no seed key. Signature interaction: the existing scroll sequence, wordmark to one-liners to call to action, unchanged. Motion grammar: that scroll choreography is the one recorded exception to print stillness. Everything else moves only as 120ms colour steps, and the static path covers reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Durable system change (approved by the owner on 2026-10-11)

DESIGN.md gains `/` as the cover: the shared header, the green contribution ramps, and the scroll-choreography exception. It no longer lists `/` as outside the system.
