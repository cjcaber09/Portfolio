import { education } from '@/data/content'

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-6 text-3xl font-bold">Education</h2>
      <p className="text-lg font-semibold">{education.degree}</p>
      <p className="text-slate-600 dark:text-slate-300">{education.school}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {education.dates} · {education.location}
      </p>
    </section>
  )
}
