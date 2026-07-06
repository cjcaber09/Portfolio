# Portfolio Site Design

**Date:** 2026-07-06
**Owner:** Carl John E. Caber

## Purpose

Build a modern personal portfolio website for Carl John E. Caber, a Full-Stack
Web Developer with 5+ years of experience (React, Vue, Node.js, PHP/Laravel,
IBM i legacy modernization). Source content is derived from `resume.docx`.

## Tech Stack

- **Next.js 14** (App Router, TypeScript) — single-page scrolling site
- **Tailwind CSS** — utility styling, `dark:` variants for theming
- **Framer Motion** — scroll-triggered fade/slide-in animations per section
- **Deployment target:** Vercel

## Theming

- Light and dark mode toggle in the nav bar
- Theme preference persisted to `localStorage`; falls back to
  `prefers-color-scheme` on first visit
- No flash-of-wrong-theme on load (theme resolved before paint via an inline
  script or Next.js-safe pattern)

## Content Data

All resume-derived content (experience, skills, projects, education, contact
info) lives in one typed file: `data/content.ts`. Components import from this
file rather than hardcoding text, so future edits don't require touching
layout/component code.

## Sections (single page, anchor-linked nav)

1. **Hero** — name, title ("Full-Stack Web Developer"), short tagline,
   CTA buttons: View Projects, Download Resume, Contact. Theme toggle lives
   in the nav here.
2. **About** — professional summary paragraph (from resume).
3. **Experience** — timeline of 3 roles, each with title, company, dates,
   and bullet responsibilities, pulled verbatim from the resume:
   - Web Developer / IT Specialist, Profound Logic (2022–2026)
   - Freelance Web Developer, Self-Employed (2020–2022)
   - Web Developer / IT Support, Seahaven Business Solutions (2018–2020)
4. **Skills** — grouped tag/pill display by category: Languages, Frontend,
   Backend, Tools & Platforms, Design, Other (as listed in resume).
5. **Projects** — 3–4 placeholder project cards inferred from work history
   (e.g. "Legacy IBM i Modernization," "Multi-Marketplace Inventory
   Integration," "Freelance Client Sites"). Each card is clearly marked in
   code with a `// TODO: replace with real project details/links/screenshots`
   comment so Carl can swap in real projects later.
6. **Education** — BS Information Technology, Southland College (2014–2018),
   Kabankalan City, Negros Island, Philippines.
7. **Contact** — icon links only (mailto:, tel:, LinkedIn, GitHub). No
   contact form, no backend/email service required.

## Resume Download

Convert `resume.docx` to PDF and place it in `/public`. Hero's "Download
Resume" button links directly to the static PDF.

## Animations

Framer Motion scroll-reveal (fade + slight slide-up) applied per section as
it enters the viewport. Kept subtle — no parallax, no heavy motion.

## Non-Goals

- No CMS or blog
- No backend/contact form/email service
- No auth or database
- No testimonials section

## Out of Scope for Follow-up

Real project details (screenshots, links, descriptions) are intentionally
left as placeholders since the resume does not list named projects. Carl
will replace these in `data/content.ts` when ready.
