---
name: CeeDev Portfolio Datasheet
description: The portfolio set as a component datasheet, a contribution-grid cover at / and one cool-inked paper sheet at /about, with a single manufacturer green.
colors:
  paper: "oklch(99.2% 0.003 250)"
  fill: "oklch(95.5% 0.006 255)"
  ink: "oklch(21% 0.02 255)"
  ink-2: "oklch(43% 0.02 255)"
  ink-3: "oklch(50% 0.018 255)"
  rule: "oklch(87% 0.01 255)"
  accent: "oklch(47% 0.1 165)"
  accent-ink: "oklch(99% 0.01 165)"
  cell-off: "oklch(88% 0.008 255)"
  paper-dark: "oklch(17.5% 0.005 255)"
  fill-dark: "oklch(21.5% 0.005 255)"
  ink-dark: "oklch(94% 0.004 255)"
  ink-2-dark: "oklch(77% 0.006 255)"
  ink-3-dark: "oklch(70% 0.006 255)"
  rule-dark: "oklch(31% 0.006 255)"
  accent-dark: "oklch(68% 0.1 165)"
  accent-ink-dark: "oklch(17.5% 0.005 255)"
  cell-off-dark: "oklch(30% 0.006 255)"
  desk: "#ffffff"
  desk-dark: "oklch(13% 0.004 255)"
  desk-dot: "rgba(148, 163, 184, 0.18)"
  contribution-light-1: "#a0d1ba"
  contribution-light-2: "#66ac8e"
  contribution-light-3: "#308a69"
  contribution-light-4: "#006c4d"
  contribution-dark-1: "#124230"
  contribution-dark-2: "#1f634a"
  contribution-dark-3: "#328666"
  contribution-dark-4: "#55ac89"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 72"
  cover-line:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 72"
  cover-line-lg:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 72"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 82"
  subtitle:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    fontVariation: "'wdth' 90"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.375
  title-sm:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
  cover-support:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  cover-support-md:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.6
  body-lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  action:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
  small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.5
  fine:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 85"
rounded:
  none: "0px"
  control: "2px"
spacing:
  cell-y: "6px"
  gap: "8px"
  cell-x: "12px"
  gutter: "20px"
  dot-grid: "22px"
  desk-x: "24px"
  desk-y: "32px"
  gutter-sm: "40px"
  section-top: "48px"
  section-top-sm: "56px"
  sheet: "75rem"
components:
  action-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "40px"
  action-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  action-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "40px"
  project-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "36px"
  dark-mode-switch:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "32px"
  column-head:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "8px 12px"
  document-bar:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    padding: "6px 40px"
  diagram-pin:
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    padding: "0 6px"
    height: "28px"
  diagram-pin-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
  meter-cell-on:
    backgroundColor: "{colors.accent}"
    size: "8px"
    rounded: "{rounded.none}"
  meter-cell-off:
    backgroundColor: "{colors.cell-off}"
    size: "8px"
    rounded: "{rounded.none}"
  trace-readout-head:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink}"
    padding: "8px 12px"
  cover-one-liner:
    textColor: "{colors.ink}"
    typography: "{typography.cover-line}"
  cover-one-liner-support:
    textColor: "{colors.ink-2}"
    typography: "{typography.cover-support}"
    width: "38rem"
  static-cover-sheet:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "40px 40px"
    width: "40rem"
  scroll-hint:
    textColor: "{colors.ink-3}"
    width: "24px"
    height: "38px"
---

# Design System: CeeDev Portfolio Datasheet

## Overview

**Creative North Star: "The Component Datasheet"**

The site is printed, not staged. `/about` is one sheet of paper laid on the site's dot-grid desk, typeset the way a manufacturer sets the front page of a part's datasheet: a green document bar, numbered sections opened by heavy ink rules, hairline-ruled tables with filled header strips, a functional block diagram, and square ten-cell rating meters. Every claim on the sheet points at a numbered entry elsewhere on it, and the typography and numbering exist to make those cross-references legible. `/` is the datasheet's cover: the same desk, the same bar, and the same face, with the CeeDev wordmark living on the desk as a green contribution grid before the reader turns to `/about`.

Density is welcome. Ink is cool and near-neutral, and one manufacturer green does the work an accent does on a printed spec: section numbers, entry numbers, links' primary actions, filled cells and pins, the document bar, the current-section marker, and on the cover the four contribution levels of the wordmark. Archivo is the only face, its width axis doing the job a second family would: condensed and heavy for the name, the cover's one-liners, and section heads, narrower still for table heads, regular width for reading. Dark mode is the same sheet inverted for night reading, not a second theme: same chroma, same green lifted only as far as contrast needs, and a neutral night desk in place of the site's old navy on every route.

The sheet is still. Nothing on it enters, fades, or floats. The only movement on the sheet is a 120ms colour step when a control changes state and the smooth jump to an anchor; under reduced motion both are instant. The cover's scroll choreography (the wordmark, the name assembling, the one-liners, the call to action) is the system's one recorded exception, it runs only on `/` from 640px, and reduced motion replaces it with a still, printed cover.

The system governs both routes. Its tokens resolve only inside the `.datasheet` wrapper, which `/` and `/about` each put around their content, with Archivo loaded once and shared. The desk (the page ground and its dot grid) sits outside the wrapper and is themed site-wide.

**Key Characteristics:**
- One paper sheet (max 75rem) on the dot-grid desk, hairline-bordered from 640px; the cover's still path uses the same sheet.
- Cool ink in three steps plus one green; every text pairing at or above 4.5:1 in both themes.
- Archivo only, with width (72% to 90%) and weight (400 to 800) carrying hierarchy.
- Numbered sections and numbered entries that the block-diagram trace cross-references.
- Hairline rules, filled header strips, square 8px markers; no shadows, gradients, pills, or cards.
- Print stillness on the sheet: 120ms colour steps only, none under reduced motion. The cover's scroll choreography is the one exception.

## Colors

Cool-tinted ink on near-white paper with one manufacturer green; dark inverts the sheet without changing its character.

### Primary
- **Manufacturer Green** (`accent`, light; `accent-dark`, dark): the single colour voice. Section and entry numbers, the document bar, the primary action's fill, filled meter cells, the selected diagram pin, the current-section underline in the nav, the brand square, Features markers, text selection, the caret, and the focus outline. Contrast as text: 6.3:1 on paper and 5.7:1 on fill (light); 6.9:1 and 6.4:1 (dark).
- **Green Ink** (`accent-ink` / `accent-ink-dark`): text and markers set on green. Near-white in light, the dark paper colour in dark. 6.3:1 light, 6.9:1 dark on the green.
- **Contribution Ramps** (`contribution-light-1` to `-4`, `contribution-dark-1` to `-4`): the cover wordmark's four activity levels, low to high, as hue-165 steps of the manufacturer green (chroma at most 0.1). On the light desk activity deepens from pale to green, oklch(82% 0.06) to (69% 0.085) to (57% 0.1) to (47% 0.1); on the night desk it brightens from deep, oklch(34% 0.06) to (45% 0.08) to (56% 0.095) to (68% 0.1). Each ramp's top level is exactly that theme's accent. Against its own desk the light ramp runs about 1.7 to 6.5:1 and the dark about 1.8 to 7.3:1. The dots are decorative pixels: the wordmark's text exists for assistive technology as a visually hidden heading and name, and the ramp is chosen by the site theme, so the dots are always drawn for the desk that is showing. Levels are assigned per dot at 20 / 30 / 30 / 20%, and the shimmer briefly steps a dot one level up or down once per 30-second cycle at its own phase.

### Neutral
- **Sheet Paper** (`paper` / `paper-dark`): the sheet, the sticky table-of-contents bar, block-diagram blocks, the cover's still sheet, and secondary controls.
- **Header Fill** (`fill` / `fill-dark`): filled header strips: column heads, table row heads, and the trace readout's head row. Also the hover ground of an unselected pin.
- **Ink** (`ink` / `ink-dark`): headings, body copy, table values, the cover's one-liners, block borders, signal lines, the heavy section rules, and the primary action's hover fill. 17.3:1 light, 15.9:1 dark on paper.
- **Ink 2** (`ink-2` / `ink-2-dark`): secondary reading text: role bullets, descriptions, dates, row heads, column-head text, inactive nav links, and the cover's supporting lines and name line. 7.9:1 light, 9.2:1 dark.
- **Ink 3** (`ink-3` / `ink-3-dark`): the quietest text and marks: signal labels, the "/10" denominator, separator dots, square bullets, external-link icons, the cover's scroll-hint mouse, and the cover's scroll-area thumb (ink-3 mixed to 35% over a transparent track, 60% on hover). 5.9:1 light, 7.1:1 dark; still body-legible.
- **Hairline Rule** (`rule` / `rule-dark`): every hairline: table rows, header strip borders, secondary-control borders, the readout frame, the nav's bottom border, the cover's one-liner rows, and link underline decoration at rest.
- **Open Cell** (`cell-off` / `cell-off-dark`): unfilled meter cells, open pin markers, the Stack column's markers, and the Dark mode switch's marker when off. Deliberately low contrast (1.4:1); these markers are decorative and the adjacent numeral or text carries the value.
- **Desk** (`desk`, light; `desk-dark`, the Night Desk): the page ground under the sheet on every route. Light is plain white; dark is the neutral night desk, which replaced the site's navy gradient so the inverted sheet reads as print. The animated cover sits directly on it.
- **Desk Dot** (`desk-dot`): the dot grid printed on the desk in both themes, 1px dots on a 22px pitch, fixed to the viewport. It is the system's one literal outside the `ds` family and belongs to the desk, never the sheet. The page scrollbar is themed from the same desk family (`oklch(70% 0.012 255)` on `oklch(96% 0.004 250)` light; `oklch(42% 0.006 255)` on the desk dark).

### Named Rules
**The One Green Rule.** Green is the only hue on the sheet. It marks numbers, state, and the one primary action; it is never a background for reading text beyond the document bar and a selected pin.

**The Same Sheet Rule.** Dark mode inverts lightness and nothing else: the chroma stays near-neutral (0.004 to 0.006), the green keeps hue 165 and chroma 0.1, and the desk goes neutral. Never introduce a slate or navy ground under the dark sheet.

**The 4.5 Floor Rule.** Every text pairing on the sheet clears 4.5:1 in both themes. A new token earns its place by passing that check, not by matching a mood.

## Typography

**Display Font:** Archivo (variable, with the `wdth` axis), falling back to ui-sans-serif, system-ui, sans-serif
**Body Font:** Archivo
**Label/Mono Font:** Archivo at condensed width; tabular numerals (`tabular-nums`) for every date, number, rating, and phone number

**Character:** One grotesque in many cuts, the way a datasheet uses one family. Width does the work a second face would: compressed and black for the name and the cover, condensed for heads, regular for reading.

### Hierarchy
- **Display** (800, clamp(2.75rem, 7vw, 5.25rem), 0.95, width 72%, -0.02em, balanced): the name on the `/about` front page.
- **Cover line** (the display cut at fixed steps: 800, 3.25rem rising to 4.5rem from 1024px, 0.95, width 72%, -0.02em, balanced, ink): the cover's three one-liners on the animated path. The static cover's CeeDev h1 uses the same cut at 3.25rem, after the brand square.
- **Cover support** (400, 1.125rem rising to 1.25rem from 768px, 1.6, ink-2, max 38rem, balanced): the supporting line under each animated one-liner.
- **Headline** (800, 1.75rem, tight, width 82%, -0.015em): numbered section heads, the green number set before the name.
- **Subtitle** (700, 1.25rem, width 90%): the professional title under the name on `/about`, and the name line (in ink-2) under CeeDev on the static cover.
- **Title** (700, 1.125rem, snug): entry titles (role, project) and the static cover's one-liner titles. **Title small** (700, 1rem): an education institution.
- **Body lead** (400, 1.125rem, 1.6 to 1.7): the tagline, the About summary, and the Contact lead. Capped at 60 to 65ch (38rem for the tagline).
- **Body** (400, 0.9375rem, 1.6 to 1.65): role bullets, project descriptions, table values, and the static cover's one-liner descriptions. Capped at 65 to 70ch.
- **Action** (600, 0.875rem): action-strip controls. The same 0.875rem size sets table text in Skills and dates, education levels, and the trace readout's hits, at reading weights.
- **Small** (600 to 700, 0.8125rem): nav links, the Dark mode switch, project links, row heads, captions ("Device information", "Features", "Figure 1."), notes, and stack lists.
- **Fine** (0.75rem): the readout's count in ink-2 at 400, and the primary action's "PDF" suffix at 700, 80% opacity.
- **Label** (700, 0.6875rem, 0.06em, width 85%, uppercase): column heads, block names in the diagram, and the readout's Roles and Projects labels. The document bar uses the same cut at 0.08em.
- **Brand** (800, 1.125rem, width 80%, -0.01em): "CeeDev" in the nav, after a 12px green square.
- **Canvas wordmark** (700, normal width): the cover's contribution-grid CeeDev and name are rasterized in Archivo at 700 and 100% width, not the display cut. This is a deliberate adaptation: it keeps the lattice geometry the wordmark was built on while setting it in the site's one face.

### Named Rules
**The Width Before Weight Rule.** Hierarchy steps through Archivo's width axis before it reaches for size: 72% display, 80% brand, 82% section heads, 85% labels, 90% title, 100% reading.

**The Uppercase Is For Tables Rule.** Uppercase tracking belongs only to labels that head a table column, a diagram block, or a readout list, plus the document bar. It never sits above a heading as a kicker.

**The Tabular Numbers Rule.** Every numeral that can be compared (dates, entry numbers, ratings, years, phone) is set tabular.

## Layout

One centred sheet, max 75rem. Below 640px the sheet runs edge to edge with no border; from 640px it gains a 1px hairline border and sits on the desk with 24px side and 32px top/bottom margins. Section gutters are 20px, 40px from 640px. Sections open 48px above the head (56px from 640px) and close 56px below (64px).

The sticky table-of-contents bar matches the sheet's width and is the same on both routes. Below 1024px it is two rows: brand and Dark mode switch on a 56px row, then a 44px link row under a hairline that scrolls sideways on a phone and keeps the current link centred in view. From 1024px brand, links, and switch share one 56px row. Anchor targets carry a scroll margin to clear it: 7.5rem below 1024px, 5rem from 1024px.

The `/about` front page fills the viewport from 1024px (100dvh less the bar) and splits into a 12-column grid: name, actions, device table, and Features in the left 7; the block diagram and its readout in the right 5. Below 1024px they stack. Features go two columns from 640px.

Tables collapse rather than scroll. Column heads appear only from 768px, where rows become grids: Experience is 11rem / 1fr from 768px, adds an 11rem Stack column from 1024px, and fixes the role column at 38rem from 1280px; Education is 11rem / 9rem / 1fr. Below 768px each row stacks and the Stack column drops under the bullets as an inline "Stack" row. Skills split into two balanced tables from 1024px. Projects go two columns from 768px with a 48px gap.

Spacing inside tables is 12px horizontal per cell with 6px to 10px vertical; controls in a strip sit 8px apart.

**The cover.** `/` is one viewport tall: the shared bar, then the cover filling the rest (the document itself does not scroll). From 640px, without reduced motion, the animated cover sits on the bare desk under the bar: the wordmark centred in the canvas, the one-liners centred in a band up to 64rem wide that stops 112px above the bottom (headline and support 20px apart), and the scroll hint and call to action sharing one centre line 48px from the bottom, never on screen together. Its scroll area is a 4-page track inside the cover. Below 640px or under reduced motion the static cover is sheet content on the sheet: paper edge to edge below 640px; from 640px a hairline-bordered paper sheet on the desk with `/about`'s margins (24px sides, 32px top and bottom). Its content is a left-aligned column, max 40rem, centred in the sheet both ways, with 20px (40px from 640px) side and 40px vertical padding; it scrolls within itself on short phones.

## Elevation & Depth

The sheet is flat. There are no shadows on either route, including the sticky bar, which separates from the content with a hairline bottom border on paper. Depth is conveyed by print devices only: the 2px ink rule that opens each section, hairline rules between rows, filled header strips, and the 1px ink border around diagram blocks. The single layering is the sheet (and the bar) over the dot-grid desk; the animated cover's wordmark is drawn flat on the desk, its dots unlit circles with no depth shading.

### Named Rules
**The Printed Sheet Rule.** If it would not survive being printed, it does not belong: no shadows, gradients, blurs, glows, or translucency on the sheet. The cover's scroll fades are motion, not material, and are governed by the Cover Choreography Rule.

## Shapes

Square. Tables, blocks, the readout, the sheet, meter cells, pins, bullets, and markers have no radius. The only rounding is a 2px corner on clickable controls (action strip, project links, Dark mode switch), enough to read as a control without becoming a pill. Markers are filled squares: 8px for meter cells, pins, Stack and Features markers, and the switch; 12px for the brand mark (0.28em before the static cover's CeeDev); 6px ink-3 squares for bullet points. Icons are a single 16px-grid set with a 1.5px square-capped, mitred stroke in currentColor, sized in em to the text beside them (1rem in action controls, 0.875rem for trailing external and in-page marks), always decorative. Two drawn exceptions are round by nature: the contribution-grid dots, and the scroll-hint mouse (a 24 by 38 outline with a fully rounded body, 1.5px stroke).

### Named Rules
**The Square Marker Rule.** State and quantity are shown with the same 8px square everywhere: filled green means on, selected, or counted; open (`cell-off`) means off. The meter, the pins, the Stack links, and the Dark mode switch all speak this one mark.

## Components

### Numbered Section
Every section opens with a 2px ink rule across the sheet, then a headline with its green tabular number before the name (1 About through 6 Contact). The number is hidden from assistive technology so the heading's name stays plain. Entries inside a section are numbered from the same table ("2.1", "4.3"), and the trace readout cites those numbers.

### Column Heads
A filled header strip: fill ground, hairline rules above and below, label type in ink-2, 8px by 12px cells. It labels list rows laid out as tables (Experience, Education), is decorative to assistive technology, and appears only from 768px.

### Ruled Tables
Hairline-ruled, border-collapsed, no vertical lines. Key-value tables (Device information, Contact) put the key in a 9rem filled row head in ink-2 at 0.8125rem and the value on paper. The Skills characteristics table opens with a filled label-type header row; each group starts with a bold 0.8125rem group row, then one ruled row per item: name, right-aligned tabular rating with a lighter "/10", and the meter.

### Ten-Cell Meter
Ten 8px squares with 2px gaps, filled green up to the self-rating and open beyond it. Decorative: the numeral in the same row is the value. Ratings are never adjusted for visual effect.

### Block Diagram
Figure 1 on the front page. Blocks are 1px ink-bordered paper boxes with 10px padding and a label-type block name; frontend spans the top, server and integrations sit side by side, data below. **Signals** between blocks are 1px ink lines (vertical down, horizontal across) with a small condensed ink-3 label naming what travels on them ("REST · JSON", "APIs", "SQL"). **Pins** are the technologies: 28px-high toggle buttons with an 8px marker and a 0.8125rem semibold name. Unselected pins are ink on paper with an open marker; hover fills the ground and darkens the marker to ink-2. The selected pin is solid green with green-ink text and marker. Exactly one pin is selected (React on load), and a technology no role or project names is not drawn.

### Trace Readout
A hairline-framed box under the figure caption, announced as a live status. Its head row is a filled strip with the selected technology in bold at 0.9375rem and a count ("Named in 3 roles and 2 projects") at 0.75rem in ink-2. Below, label-type "Roles" and "Projects" lists give each hit as a green tabular entry number in a 28px column and an underlined link to that entry. Links anywhere on the page to `#tech-*` select the matching pin.

### Action Strip
The site's controls, shared by both routes, 8px apart and wrapping: 40px high, 2px corners, 12px side padding, 0.875rem semibold, icon plus label. **Primary** is solid green with green-ink text; hover steps to solid ink with paper text. On `/about` it is Download resume, first, with a download icon and a lighter "PDF" suffix; on the cover it is View My Work, the cover's only action, with a trailing right arrow (ArrowRightIcon, 1rem). **Secondary** (Email, LinkedIn, GitHub, Projects) is ink on paper with a hairline border; hover darkens the border to ink. External and in-page icons are ink-3. Project links reuse the same pair at 36px and 0.8125rem, the first link of each project primary.

### Stack Column
The Experience row's third column (an inline row below 1024px): a 0.8125rem list of technologies, each an 8px open marker that fills green on hover beside a semibold ink name with a hairline underline that darkens on hover. Each links to its pin in Figure 1, running the trace backwards.

### Features List
The front page's competencies under a bold 0.8125rem "Features" caption: ruled rows (hairline top on the first row of each column, hairline below every row), 8px vertical padding, an 8px solid green square before each item. Two columns from 640px.

### Navigation (Table of Contents)
Sticky paper bar with a hairline bottom, the same component on `/` and `/about`. Brand at left, linking to the cover; links in 0.8125rem semibold, Home (the `/about` front page) first, then About to Contact, all pointing into `/about`. Inactive links are ink-2 and step to ink on hover; on `/about` the current section (detected at a reading band a third of the way down the viewport) is ink with a 2px green underline flush with the bar's bottom. On the cover no section is current, so no link is marked.

### Dark Mode Switch
A labelled toggle, not an icon: "Dark mode" in 0.8125rem semibold ink, 32px high, 2px corners, hairline border that darkens to ink-2 on hover, with an 8px marker before the text, green when on and open when off. The pressed state carries the value for assistive technology. It is the site's only theme control.

### Contribution-Grid Wordmark
The cover's signature. CeeDev and, below it, Carl John Caber are rasterized in Archivo 700 and sampled onto one shared lattice of small round dots, each coloured from the theme's contribution ramp and shimmering on its own phase. CeeDev is formed on the first frame and never moves; the name's dots fly in from a scatter as the reader scrolls. The canvas fits the lattice to the viewport (at most 960px wide). Visually hidden h1 and name text stand in for the pixels.

### Cover One-Liners
Three statements, each a cover-line headline in ink over a cover-support line in ink-2, centred, shown one at a time on the animated path. On the static cover they become ruled rows under a hairline top: a 1.125rem bold title and a 0.9375rem ink-2 description, 16px vertical padding.

### Scroll Hint
A 24 by 38 mouse outline drawn at a 1.5px stroke in ink-3 with a 2.5px-radius wheel dot, bottom centre on the first screen of the animated cover. Decorative; the scroll area itself carries the label.

### Intro Scroll Area
The animated cover's scroll track is focusable and labelled ("Scroll to reveal introduction") and answers arrows, Page Up/Down, Space, Home, and End. Its thin scrollbar is a transparent track with an ink-3 thumb, and its focus ring is the sheet's 2px green outline drawn inset (offset -2px) so the screen edge cannot clip it. The ring shows on keyboard focus only.

### Links and Focus
In-sheet links are underlined 1px at a 0.22em offset; in tables and lists the underline rests in the rule colour and darkens to ink on hover. Focus everywhere is a 2px green outline offset 2px (inset on the intro scroll area). Text selection is green with green-ink text.

### Motion
Print stillness on the sheet. The only animated property is colour (backgrounds, borders, text, decoration) on state change, over 120ms with the default ease, plus the smooth scroll to an anchor. Under `prefers-reduced-motion: reduce`, transitions drop to 0s and scrolling jumps.

**The cover's choreography** is the single exception, and it exists only on `/`. Scroll offset runs 0 to 1 over four viewport heights with 0.2 damping, and every fade has a 0.06 edge. The wordmark is fully visible from the first frame and fades out by 0.32; the name assembles from its scatter over 0 to 0.2. The one-liners follow in turn (0.34 to 0.54, 0.56 to 0.76, 0.78 onward), each fading in while rising 40px into place and drifting up as it leaves. The call to action fades in from 0.84 and stays; while invisible it is hidden, so it cannot be clicked or focused. Ambient motion is the wordmark's shimmer (each dot briefly stepping a level once per 30-second cycle) and the scroll hint's 1.8s wheel loop, which drifts the wheel dot 9px down and fades it; the hint is gone by 0.1 and never returns. Reduced motion and widths under 640px get the static cover instead, so none of this runs; the wheel loop also stops under reduced motion.

### Named Rules
**The Cover Choreography Rule.** Scroll-driven and ambient motion belong to the `/` cover's wordmark sequence alone, run only on the animated path, and are replaced by the static cover under reduced motion or below 640px. No other surface fades, slides, or reveals on scroll.

## Do's and Don'ts

### Do:
- **Do** keep every new surface inside the `.datasheet` wrapper and colour it only with the `ds` tokens, so it inverts with the sheet.
- **Do** open each section with the 2px ink rule and a green tabular number, and number entries from the shared section table so the trace can cite them.
- **Do** present structured facts as hairline-ruled tables with filled header strips or filled row heads.
- **Do** show state and quantity with the 8px square marker: green filled for on, `cell-off` for off.
- **Do** step hierarchy through Archivo's width axis (72% to 90%) and weights 400 to 800, with tabular numerals for anything comparable.
- **Do** limit motion to 120ms colour steps and anchor scrolls, and make both instant under reduced motion; the `/` cover's scroll choreography is the one recorded exception, with the static cover as its reduced-motion and narrow-screen path.
- **Do** keep a single primary action per strip, solid green, with secondaries as hairline-bordered ink controls.
- **Do** use the shared table-of-contents bar on every route, marking no section current where the page holds none.
- **Do** draw the contribution grid only from the theme's own ramp, so its top level is that theme's accent.

### Don't:
- **Don't** use gradients, shadows, blurs, or translucency on the sheet.
- **Don't** round anything beyond the 2px control corner; no pills, chips, or tag capsules.
- **Don't** box content entries (roles, projects, skills) into cards; borders belong to tables, the diagram's blocks, the readout, and controls.
- **Don't** render skills as continuous progress bars or percentages; ratings are the ten-cell meter beside the numeral.
- **Don't** set experience as a vertical timeline with dots and a spine; it is a numbered revision table.
- **Don't** fade, slide, or reveal content on scroll, or animate anything but colour, outside the `/` cover's recorded choreography.
- **Don't** add a second hue, or a navy or slate ground under the dark sheet.
- **Don't** set uppercase tracked labels above headings as kickers; uppercase is for table, block, and readout labels and the document bar.
- **Don't** use emoji or text glyphs as icons; use the 16px stroked icon set.
