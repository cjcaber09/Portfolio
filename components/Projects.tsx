import { projects } from '@/data/content'

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-10 text-3xl font-bold">Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.title}
            className="rounded-lg border border-slate-200 p-6 dark:border-slate-800"
          >
            <h3 className="mb-2 font-semibold">{project.title}</h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  {tech}
                </span>
              ))}
            </div>
            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.links.map((link, index) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      index === 0
                        ? 'inline-block rounded-md bg-[linear-gradient(90deg,#0f766e,#15803d)] px-3 py-1.5 text-sm font-medium text-white transition hover:brightness-110'
                        : 'inline-block rounded-md border border-emerald-700/50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-400/50 dark:text-emerald-400 dark:hover:bg-emerald-950/40'
                    }
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
