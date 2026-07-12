import { education } from '@/data/content'

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-10 text-3xl font-bold">Education</h2>
      <ol className="space-y-8 border-l border-slate-200 pl-6 dark:border-slate-800">
        {education.map((entry) => (
          <li key={`${entry.school}-${entry.level}`}>
            <p className="text-sm text-sky-600 dark:text-sky-400">{entry.dates}</p>
            <h3 className="text-lg font-semibold">{entry.school}</h3>
            {entry.degree && (
              <p className="text-slate-600 dark:text-slate-300">{entry.degree}</p>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {entry.level}
              {entry.location ? ` · ${entry.location}` : ''}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
