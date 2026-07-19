import { profile } from '@/data/content'

export function Hero() {
  return (
    <section id="hero" className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-24">
      <p className="text-emerald-700 dark:text-emerald-400">Hi, I&apos;m</p>
      <h1 className="text-4xl font-bold sm:text-5xl">{profile.name}</h1>
      <h2 className="text-xl text-slate-600 dark:text-slate-300">{profile.title}</h2>
      <p className="max-w-2xl text-slate-600 dark:text-slate-300">{profile.tagline}</p>
      <div className="flex flex-wrap gap-4">
        <a
          href="#projects"
          className="rounded-md bg-[linear-gradient(90deg,#0f766e,#15803d)] px-5 py-3 text-white transition hover:brightness-110"
        >
          View Projects
        </a>
        <a
          href="/resume.pdf"
          download
          className="rounded-md border border-slate-300 px-5 py-3 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Download Resume
        </a>
        <a
          href="#contact"
          className="rounded-md border border-slate-300 px-5 py-3 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          Contact
        </a>
      </div>
    </section>
  )
}
