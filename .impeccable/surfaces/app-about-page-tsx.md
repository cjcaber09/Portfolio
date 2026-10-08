---
version: 1
slug: "app-about-page-tsx"
primary_target: "app/about/page.tsx"
related_targets: []
---

# /about surface brief

## Scope and mode

`/about` only (`app/about/page.tsx` and the section components it renders). Visitor mode: Persuade. The `/` animated intro and its nav stay exactly as they are; `/about` gets its own nav, which adds a Home link to `#hero`.

## Audience, job, action, proof, constraints

- Recruiters and hiring managers deciding whether to interview Carl.
- Action: download the résumé (`/resume.pdf`) or make contact.
- Proof: roles, project descriptions, Supademo demos, GitHub source. No project imagery exists, and none is to be invented.
- Owner's limits: not flashy, not generic, not corporate or stiff. Density is acceptable. Both light and dark themes stay.

## Direction contract

THESIS: Carl specified like a component. A datasheet whose front page states what he is, what he runs, and how to get him, with every claim traceable to production work. It refuses the category default: a hero, skill bars, tag-pill cards, and a vertical timeline.

OWN-WORLD: Datasheet print. One paper sheet on the existing dot-grid desk, with ink tinted cool and one manufacturer green for the top bar, section numbers, links, and filled rating cells. Archivo throughout: a heavy cut for the name and condensed widths for table heads. Tabular numerals, hairline-ruled tables with filled header rows, numbered sections, and square ten-cell rating meters. No gradients, pills, cards, shadows, or fades. Dark mode is the same sheet inverted for night reading.

STORY: A recruiter learns in one screen who Carl is and what he builds with. They trace any technology to the roles and projects where it shipped, read experience as a revision history and skills as a characteristics table, then download the résumé or make contact.

FIRST VIEWPORT: A sticky table-of-contents bar holds CeeDev, Home to Contact with the current section marked, and the theme switch. At the top of the sheet sit a green bar and a document line. The left two-thirds carry the name at display scale, then the title, the tagline, and an action strip with Download resume as the primary action ahead of Email, LinkedIn, GitHub, and Projects. A device-information table sits under it. The right third holds the live functional block diagram with React selected, and a readout lists the roles and applications that used it.

FORM: Component datasheet, position 1 of the ordered grounded list, seed key f9b18deb. Signature interaction: the block-diagram trace. Motion grammar: print stillness. Only state changes move, as 120ms colour steps, and nothing moves under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

Selecting a technology in the block diagram lists exactly which jobs and projects used it.

## Unresolved

- Three projects remain placeholders with no links. They render as-is.
- The ATI LLC and Andy Experiences roles sit on an unmerged branch (`feature/add-ati-llc-experience`). The Experience layout must keep one `<li>` with one `<h3>` per role, so that branch's test keeps passing after merge.
