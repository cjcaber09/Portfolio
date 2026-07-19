import { summary, coreCompetencies } from '@/data/content'

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-6 text-3xl font-bold">About</h2>
      <p className="max-w-3xl text-slate-600 dark:text-slate-300">{summary}</p>
      <h3 className="mt-8 mb-3 font-semibold text-slate-900 dark:text-slate-100">
        Core Competencies
      </h3>
      <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
        {coreCompetencies.join('  •  ')}
      </p>
    </section>
  )
}
