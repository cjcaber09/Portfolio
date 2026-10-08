---
name: CeeDev Portfolio Datasheet
description: The /about portfolio set as a component datasheet, one cool-inked paper sheet with a single manufacturer green.
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
  desk-dark: "oklch(13% 0.004 255)"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5.25rem)"
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
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.375
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
  small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.5
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
  gutter-sm: "40px"
  section-top: "48px"
  section-top-sm: "56px"
  sheet: "75rem"
components:
  action-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.small}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "40px"
  action-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  action-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "40px"
  project-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
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
---

# Design System: CeeDev Portfolio Datasheet

## Overview

**Creative North Star: "The Component Datasheet"**

The `/about` route is printed, not staged. It is one sheet of paper laid on the site's dot-grid desk, typeset the way a manufacturer sets the front page of a part's datasheet: a green document bar, numbered sections opened by heavy ink rules, hairline-ruled tables with filled header strips, a functional block diagram, and square ten-cell rating meters. Every claim on the sheet points at a numbered entry elsewhere on it, and the typography and numbering exist to make those cross-references legible.

Density is welcome. Ink is cool and near-neutral, and one manufacturer green does the work an accent does on a printed spec: section numbers, entry numbers, links' primary actions, filled cells and pins, the document bar, and the current-section marker. Archivo is the only face, its width axis doing the job a second family would: condensed and heavy for the name and section heads, narrower still for table heads, regular width for reading. Dark mode is the same sheet inverted for night reading, not a second theme: same chroma, same green lifted only as far as contrast needs, and a neutral desk in place of the site's navy.

The sheet is still. Nothing enters, fades, or floats. The only movement is a 120ms colour step when a control changes state and the smooth jump to an anchor; under reduced motion both are instant.

This system governs `/about` only. The `/` route (the animated Three.js intro, its `Nav`, and the round emoji theme button) is a separate, pre-existing surface outside this system and does not follow it. The datasheet tokens resolve only inside the `.datasheet` wrapper, so `/` never inherits them.

**Key Characteristics:**
- One paper sheet (max 75rem) on the dot-grid desk, hairline-bordered from 640px.
- Cool ink in three steps plus one green; every text pairing at or above 4.5:1 in both themes.
- Archivo only, with width (72% to 90%) and weight (400 to 800) carrying hierarchy.
- Numbered sections and numbered entries that the block-diagram trace cross-references.
- Hairline rules, filled header strips, square 8px markers; no shadows, gradients, pills, or cards.
- Print stillness: 120ms colour steps only, none under reduced motion.

## Colors

Cool-tinted ink on near-white paper with one manufacturer green; dark inverts the sheet without changing its character.

### Primary
- **Manufacturer Green** (`accent`, light; `accent-dark`, dark): the single colour voice. Section and entry numbers, the document bar, the primary action's fill, filled meter cells, the selected diagram pin, the current-section underline in the nav, the brand square, Features markers, text selection, the caret, and the focus outline. Contrast as text: 6.3:1 on paper and 5.7:1 on fill (light); 6.9:1 and 6.4:1 (dark).
- **Green Ink** (`accent-ink` / `accent-ink-dark`): text and markers set on green. Near-white in light, the dark paper colour in dark. 6.3:1 light, 6.9:1 dark on the green.

### Neutral
- **Sheet Paper** (`paper` / `paper-dark`): the sheet, the sticky table-of-contents bar, block-diagram blocks, and secondary controls.
- **Header Fill** (`fill` / `fill-dark`): filled header strips: column heads, table row heads, and the trace readout's head row. Also the hover ground of an unselected pin.
- **Ink** (`ink` / `ink-dark`): headings, body copy, table values, block borders, signal lines, the heavy section rules, and the primary action's hover fill. 17.3:1 light, 15.9:1 dark on paper.
- **Ink 2** (`ink-2` / `ink-2-dark`): secondary reading text: role bullets, descriptions, dates, row heads, column-head text, inactive nav links. 7.9:1 light, 9.2:1 dark.
- **Ink 3** (`ink-3` / `ink-3-dark`): the quietest text: signal labels, the "/10" denominator, separator dots, square bullets, external-link icons. 5.9:1 light, 7.1:1 dark; still body-legible.
- **Hairline Rule** (`rule` / `rule-dark`): every hairline: table rows, header strip borders, secondary-control borders, the readout frame, the nav's bottom border, and link underline decoration at rest.
- **Open Cell** (`cell-off` / `cell-off-dark`): unfilled meter cells, open pin markers, the Stack column's markers, and the Dark mode switch's marker when off. Deliberately low contrast (1.4:1); these markers are decorative and the adjacent numeral or text carries the value.
- **Night Desk** (`desk-dark`): the ground under the dark sheet on `/about`, replacing the site's navy gradient so the inverted sheet reads as print. The page scrollbar is themed from the same family (`oklch(70% 0.012 255)` on `oklch(96% 0.004 250)` light; `oklch(42% 0.006 255)` on the desk dark).

### Named Rules
**The One Green Rule.** Green is the only hue on the sheet. It marks numbers, state, and the one primary action; it is never a background for reading text beyond the document bar and a selected pin.

**The Same Sheet Rule.** Dark mode inverts lightness and nothing else: the chroma stays near-neutral (0.004 to 0.006), the green keeps hue 165 and chroma 0.1, and the desk goes neutral. Never introduce a slate or navy ground under the dark sheet.

**The 4.5 Floor Rule.** Every text pairing on the sheet clears 4.5:1 in both themes. A new token earns its place by passing that check, not by matching a mood.

## Typography

**Display Font:** Archivo (variable, with the `wdth` axis), falling back to ui-sans-serif, system-ui, sans-serif
**Body Font:** Archivo
**Label/Mono Font:** Archivo at condensed width; tabular numerals (`tabular-nums`) for every date, number, rating, and phone number

**Character:** One grotesque in many cuts, the way a datasheet uses one family. Width does the work a second face would: compressed and black for the name, condensed for heads, regular for reading.

### Hierarchy
- **Display** (800, clamp(2.75rem, 7vw, 5.25rem), 0.95, width 72%, -0.02em, balanced): the name on the front page only.
- **Headline** (800, 1.75rem, tight, width 82%, -0.015em): numbered section heads, the green number set before the name.
- **Title** (700, 1.25rem, width 90%): the professional title under the name. Entry titles (role, project) are 700 at 1.125rem, snug; an education institution is 700 at 1rem.
- **Body lead** (400, 1.125rem, 1.6 to 1.7): the tagline, the About summary, and the Contact lead. Capped at 60 to 65ch (38rem for the tagline).
- **Body** (400, 0.9375rem, 1.6 to 1.65): role bullets, project descriptions, table values. Capped at 65 to 70ch. Table text inside skills and dates sits at 0.875rem.
- **Small** (600 to 700, 0.8125rem): nav links, controls, row heads, captions ("Device information", "Features", "Figure 1."), notes, and stack lists.
- **Label** (700, 0.6875rem, 0.06em, width 85%, uppercase): column heads, block names in the diagram, and the readout's Roles and Projects labels. The document bar uses the same cut at 0.08em.
- **Brand** (800, 1.125rem, width 80%, -0.01em): "CeeDev" in the nav, after a 12px green square.

### Named Rules
**The Width Before Weight Rule.** Hierarchy steps through Archivo's width axis before it reaches for size: 72% display, 80% brand, 82% section heads, 85% labels, 90% title, 100% reading.

**The Uppercase Is For Tables Rule.** Uppercase tracking belongs only to labels that head a table column, a diagram block, or a readout list, plus the document bar. It never sits above a heading as a kicker.

**The Tabular Numbers Rule.** Every numeral that can be compared (dates, entry numbers, ratings, years, phone) is set tabular.

## Layout

One centred sheet, max 75rem. Below 640px the sheet runs edge to edge with no border; from 640px it gains a 1px hairline border and sits on the desk with 24px side and 32px top/bottom margins. Section gutters are 20px, 40px from 640px. Sections open 48px above the head (56px from 640px) and close 56px below (64px).

The sticky table-of-contents bar matches the sheet's width. Below 1024px it is two rows: brand and Dark mode switch on a 56px row, then a 44px link row under a hairline that scrolls sideways on a phone and keeps the current link centred in view. From 1024px brand, links, and switch share one 56px row. Anchor targets carry a scroll margin to clear it: 7.5rem below 1024px, 5rem from 1024px.

The front page fills the viewport from 1024px (100dvh less the bar) and splits into a 12-column grid: name, actions, device table, and Features in the left 7; the block diagram and its readout in the right 5. Below 1024px they stack. Features go two columns from 640px.

Tables collapse rather than scroll. Column heads appear only from 768px, where rows become grids: Experience is 11rem / 1fr from 768px, adds an 11rem Stack column from 1024px, and fixes the role column at 38rem from 1280px; Education is 11rem / 9rem / 1fr. Below 768px each row stacks and the Stack column drops under the bullets as an inline "Stack" row. Skills split into two balanced tables from 1024px. Projects go two columns from 768px with a 48px gap.

Spacing inside tables is 12px horizontal per cell with 6px to 10px vertical; controls in a strip sit 8px apart.

## Elevation & Depth

The sheet is flat. There are no shadows anywhere on `/about`, including the sticky bar, which separates from the content with a hairline bottom border on paper. Depth is conveyed by print devices only: the 2px ink rule that opens each section, hairline rules between rows, filled header strips, and the 1px ink border around diagram blocks. The single layering is the sheet over the dot-grid desk.

### Named Rules
**The Printed Sheet Rule.** If it would not survive being printed, it does not belong: no shadows, gradients, blurs, glows, or translucency on the sheet.

## Shapes

Square. Tables, blocks, the readout, the sheet, meter cells, pins, bullets, and markers have no radius. The only rounding is a 2px corner on clickable controls (action strip, project links, Dark mode switch), enough to read as a control without becoming a pill. Markers are filled squares: 8px for meter cells, pins, Stack and Features markers, and the switch; 12px for the brand mark; 6px ink-3 squares for bullet points. Icons are a single 16px-grid set with a 1.5px square-capped, mitred stroke in currentColor, sized in em to the text beside them, always decorative.

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
The front page's controls, 8px apart and wrapping: 40px high, 2px corners, 12px side padding, 0.875rem semibold, icon plus label. **Primary** (Download resume, first, with a lighter "PDF" suffix) is solid green with green-ink text; hover steps to solid ink with paper text. **Secondary** (Email, LinkedIn, GitHub, Projects) is ink on paper with a hairline border; hover darkens the border to ink. External and in-page icons are ink-3. Project links reuse the same pair at 36px and 0.8125rem, the first link of each project primary.

### Stack Column
The Experience row's third column (an inline row below 1024px): a 0.8125rem list of technologies, each an 8px open marker that fills green on hover beside a semibold ink name with a hairline underline that darkens on hover. Each links to its pin in Figure 1, running the trace backwards.

### Features List
The front page's competencies under a bold 0.8125rem "Features" caption: ruled rows (hairline top on the first row of each column, hairline below every row), 8px vertical padding, an 8px solid green square before each item. Two columns from 640px.

### Navigation (Table of Contents)
Sticky paper bar with a hairline bottom. Brand at left; links in 0.8125rem semibold, Home first, then About to Contact. Inactive links are ink-2 and step to ink on hover; the current section (detected at a reading band a third of the way down the viewport) is ink with a 2px green underline flush with the bar's bottom.

### Dark Mode Switch
A labelled toggle, not an icon: "Dark mode" in 0.8125rem semibold ink, 32px high, 2px corners, hairline border that darkens to ink-2 on hover, with an 8px marker before the text, green when on and open when off. The pressed state carries the value for assistive technology.

### Links and Focus
In-sheet links are underlined 1px at a 0.22em offset; in tables and lists the underline rests in the rule colour and darkens to ink on hover. Focus everywhere is a 2px green outline offset 2px. Text selection is green with green-ink text.

### Motion
Print stillness. The only animated property is colour (backgrounds, borders, text, decoration) on state change, over 120ms with the default ease, plus the smooth scroll to an anchor. Under `prefers-reduced-motion: reduce`, transitions drop to 0s and scrolling jumps.

## Do's and Don'ts

### Do:
- **Do** keep every new surface inside the `.datasheet` wrapper and colour it only with the `ds` tokens, so it inverts with the sheet.
- **Do** open each section with the 2px ink rule and a green tabular number, and number entries from the shared section table so the trace can cite them.
- **Do** present structured facts as hairline-ruled tables with filled header strips or filled row heads.
- **Do** show state and quantity with the 8px square marker: green filled for on, `cell-off` for off.
- **Do** step hierarchy through Archivo's width axis (72% to 90%) and weights 400 to 800, with tabular numerals for anything comparable.
- **Do** limit motion to 120ms colour steps and anchor scrolls, and make both instant under reduced motion.
- **Do** keep a single primary action per strip, solid green, with secondaries as hairline-bordered ink controls.

### Don't:
- **Don't** use gradients, shadows, blurs, or translucency on the sheet.
- **Don't** round anything beyond the 2px control corner; no pills, chips, or tag capsules.
- **Don't** box content entries (roles, projects, skills) into cards; borders belong to tables, the diagram's blocks, the readout, and controls.
- **Don't** render skills as continuous progress bars or percentages; ratings are the ten-cell meter beside the numeral.
- **Don't** set experience as a vertical timeline with dots and a spine; it is a numbered revision table.
- **Don't** fade, slide, or reveal content on scroll, or animate anything but colour.
- **Don't** add a second hue, or a navy or slate ground under the dark sheet.
- **Don't** set uppercase tracked labels above headings as kickers; uppercase is for table, block, and readout labels and the document bar.
- **Don't** use emoji or text glyphs as icons; use the 16px stroked icon set.
