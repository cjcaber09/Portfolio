# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers deciding whether to interview or hire Carl John E. Caber for a full-time or contract web developer role. They arrive from a job application, a resume, LinkedIn, or GitHub, and leave by downloading the resume, opening a project demo or its source, or making contact.

## Product Purpose

The personal portfolio of Carl John E. Caber, a full-stack web developer. It has two surfaces:

- `/` (Home): an animated Three.js intro (the "CeeDev" contribution-grid wordmark and scroll-revealed highlights) that hands off to the portfolio. It is a separate surface and out of scope for work on `/about`.
- `/about`: the portfolio itself. Hero, about/summary and core competencies, experience, skills, projects, education, and contact.

Success is a recruiter reaching out, or moving Carl to interview, because the page made his capability credible.

## Positioning

Practical full-stack breadth proven on real production work, not tutorial projects. The range (React, Vue, Laravel, Node/Express, PostgreSQL/MySQL) is backed by delivery: modernizing legacy IBM i applications with a React front end, Stripe integration and an AI-reply markdown parser on an internal Vue.js tool, multi-marketplace inventory integrations (Amazon MWS, eBay, Newegg, Walmart), and a multi-tenant hotel booking SaaS with row-level-security tenant isolation.

## Operating Context

- Resume: a downloadable PDF (`public/resume.pdf`), linked from the hero.
- Project proof: interactive Supademo walkthroughs (user-facing and admin-facing) for the hotel booking SaaS; public GitHub source for the task management app and the messaging app.
- Contact: email, phone, LinkedIn, and GitHub.
- Light and dark themes, toggled from the nav; the visitor's choice persists.

## Capabilities and Constraints

- All copy and facts live in `data/content.ts`; components render it. Content changes there, not in components.
- Skill levels are Carl's own 0–10 self-ratings. They are his to set and must not be adjusted for visual effect.
- Experience dates and titles come from Carl and must stay exact.
- The `/` animated intro is out of scope for `/about` work. Nav links into `/about` sections (`/about#about`, `#experience`, and so on) must keep working from both surfaces.
- Open: three projects are placeholders (marked `TODO` in `data/content.ts`) with no links or screenshots: Legacy IBM i Modernization, Multi-Marketplace Inventory Integration, and Freelance Client Web Applications.

## Brand Commitments

- Name: "Carl John E. Caber" on `/about` (matches the resume); "Carl John Caber" on the `/` wordmark.
- Brand mark: "CeeDev", used as the nav brand link to `/`.
- No binding palette or typography. Carl confirmed on 2026-10-08 that the visuals of `/about` are open to replacement; only the facts must be preserved.

## Evidence on Hand

- `public/resume.pdf`.
- Supademo demos and GitHub source links, as listed in `data/content.ts` under `projects`.
- Experience roles, self-rated skill groups, and education entries, all in `data/content.ts`.
- Absent, and not to be fabricated: project screenshots or imagery, testimonials, client names beyond the employers listed, metrics or outcomes not stated in the resume, and certifications.

## Product Principles

1. Proof over claims. Every claim of breadth should point at real work: a role, a shipped project, a demo, or source.
2. The recruiter's decision should be fast. Who Carl is, what he builds with, what he has shipped, and how to reach him or get the resume must be reachable without hunting.
3. Accuracy is non-negotiable. Dates, titles, ratings, and claims mirror Carl's own record and are never inflated.
4. Range anchored in production. Show breadth across stacks, tied to delivered outcomes rather than a wall of logos.

## Accessibility & Inclusion

Keep what the site already supports: both themes legible, keyboard operability, and `prefers-reduced-motion` respected.
