import { projects, type Project } from '@/data/content'
import { DatasheetSection } from './about/DatasheetSection'
import { ProjectFigure } from './about/ProjectFigure'
import { SECTION_NUMBER, entryNumber, projectAnchorId } from './about/sections'
import { ExternalIcon } from './icons'

const linkBase =
  'inline-flex h-9 items-center gap-1.5 rounded-[2px] border px-3 text-[0.8125rem] font-semibold no-underline transition-colors duration-[120ms]'

// Figure 1 is the block diagram on the front page; project figures follow it.
const FIRST_PROJECT_FIGURE = 2

// An entry's text: numbered title, description, stack, and links.
function ProjectText({ project, index }: { project: Project; index: number }) {
  return (
    <>
      <h3 className="flex items-baseline gap-3 text-[1.125rem] leading-snug font-bold">
        <span className="text-[0.9375rem] text-ds-accent tabular-nums">{entryNumber('projects', index)}</span>
        <span>{project.title}</span>
      </h3>
      <p className="mt-3 max-w-[65ch] text-[0.9375rem] leading-[1.65] text-ds-ink-2">{project.description}</p>
      <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.8125rem]">
        <span className="font-bold text-ds-ink-2">Built with</span>
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="font-semibold after:ml-3 after:text-ds-ink-3 after:content-['·'] last:after:content-none"
          >
            {tech}
          </span>
        ))}
      </p>
      {project.links && project.links.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.links.map((link, linkIndex) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  linkIndex === 0
                    ? `${linkBase} border-ds-accent bg-ds-accent text-ds-accent-ink hover:border-ds-ink hover:bg-ds-ink hover:text-ds-paper`
                    : `${linkBase} border-ds-rule text-ds-ink hover:border-ds-ink`
                }
              >
                {link.label}
                <ExternalIcon className="text-[0.8125rem]" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

// Projects as typical-application notes: ruled entries, numbered so the block
// diagram's trace can point at them, never boxed into a card grid. The title
// sits directly inside each entry's <div>, with the links, so an entry and
// its links always travel together. A project with real screenshots spans the
// full width, its text beside a numbered figure of the screens.
export function Projects() {
  return (
    <DatasheetSection id="projects" number={SECTION_NUMBER.projects} title="Projects">
      <div className="grid gap-x-12 md:grid-cols-2">
        {projects.map((project, index) => {
          const id = projectAnchorId(project)
          if (!project.figure) {
            return (
              <div key={project.title} id={id} className="border-t border-ds-ink py-6">
                <ProjectText project={project} index={index} />
              </div>
            )
          }
          const figureNumber =
            FIRST_PROJECT_FIGURE + projects.slice(0, index).filter((earlier) => earlier.figure).length
          return (
            <div
              key={project.title}
              id={id}
              className="border-t border-ds-ink py-6 md:col-span-2 lg:grid lg:grid-cols-12 lg:gap-x-12"
            >
              <div className="lg:col-span-5">
                <ProjectText project={project} index={index} />
              </div>
              <ProjectFigure
                figure={project.figure}
                number={figureNumber}
                title={project.title}
                id={id}
                className="mt-8 lg:col-span-7 lg:mt-1"
              />
            </div>
          )
        })}
      </div>
    </DatasheetSection>
  )
}
