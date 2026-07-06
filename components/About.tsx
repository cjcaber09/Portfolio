import { summary } from '@/data/content'

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-6 text-3xl font-bold">About</h2>
      <p className="max-w-3xl text-slate-600 dark:text-slate-300">{summary}</p>
    </section>
  )
}
