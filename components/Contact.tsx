import { profile } from '@/data/content'

export function Contact() {
  const telHref = `tel:${profile.phone.replace(/\s+/g, '')}`

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <h2 className="mb-6 text-3xl font-bold">Contact</h2>
      <p className="mb-6 max-w-2xl text-slate-600 dark:text-slate-300">
        Feel free to reach out — I&apos;m open to new opportunities and collaborations.
      </p>
      <ul className="flex flex-wrap gap-6 text-sm">
        <li>
          <a href={`mailto:${profile.email}`} className="hover:text-emerald-700 dark:hover:text-emerald-400">
            {profile.email}
          </a>
        </li>
        <li>
          <a href={telHref} className="hover:text-emerald-700 dark:hover:text-emerald-400">
            {profile.phone}
          </a>
        </li>
        <li>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            GitHub
          </a>
        </li>
      </ul>
    </section>
  )
}
