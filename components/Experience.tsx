import { experience } from '@/data/content'

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-10 text-3xl font-bold">Experience</h2>
      <ol className="space-y-10 border-l border-slate-200 pl-6 dark:border-slate-800">
        {experience.map((role) => (
          <li key={`${role.company}-${role.title}`}>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">{role.dates}</p>
            <h3 className="text-lg font-semibold">
              {role.title} · {role.company}
            </h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
