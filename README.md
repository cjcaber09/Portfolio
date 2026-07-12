# Carl John E. Caber — Portfolio

Personal portfolio site built with Next.js, Tailwind CSS v4, and Framer Motion.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npx vitest run
```

## Content

All resume-derived content (profile, summary, experience, skills, education,
contact links) lives in `data/content.ts`. Edit that file to update site copy
without touching component code.

The `projects` array in `data/content.ts` currently holds placeholder entries
inferred from work history (marked with `// TODO` comments in the source).
Replace them with real project titles, descriptions, tech stacks, and links
when available.

## Deployment

Deploy to [Vercel](https://vercel.com/new) by importing this repository —
no additional configuration required.
