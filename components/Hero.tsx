import type { ReactNode } from 'react'
import { coreCompetencies, experience, profile } from '@/data/content'
import { StackDiagram } from './about/StackDiagram'
import { ArrowDownIcon, DownloadIcon, ExternalIcon, MailIcon } from './icons'

// The span of Carl's experience, read off the role dates so the front page
// never states a year the record doesn't.
function experienceYears() {
  const years = experience.flatMap((role) => role.dates.match(/\d{4}/g) ?? []).map(Number)
  return { first: Math.min(...years), last: Math.max(...years) }
}

const actionBase =
  'inline-flex h-10 items-center gap-2 rounded-[2px] border px-3 text-[0.875rem] font-semibold no-underline transition-colors duration-[120ms]'
const actionPrimary = `${actionBase} border-ds-accent bg-ds-accent text-ds-accent-ink hover:bg-ds-ink hover:border-ds-ink hover:text-ds-paper`
const actionSecondary = `${actionBase} border-ds-rule text-ds-ink hover:border-ds-ink`

function Action({
  href,
  primary = false,
  external = false,
  download = false,
  children,
}: {
  href: string
  primary?: boolean
  external?: boolean
  download?: boolean
  children: ReactNode
}) {
  return (
    <li>
      <a
        href={href}
        download={download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className={primary ? actionPrimary : actionSecondary}
      >
        {children}
      </a>
    </li>
  )
}

export function Hero() {
  const { first, last } = experienceYears()

  return (
    <section id="hero" className="flex flex-col lg:min-h-[calc(100dvh-5.5rem)]">
      <div className="flex justify-between gap-4 bg-ds-accent px-5 py-1.5 text-[0.6875rem] font-bold tracking-[0.08em] text-ds-accent-ink uppercase [font-stretch:85%] sm:px-10">
        <span>Portfolio datasheet</span>
        <span className="tabular-nums">
          {first} — {last}
        </span>
      </div>

      <div className="grid flex-1 content-center gap-12 px-5 py-10 sm:px-10 sm:py-12 lg:grid-cols-12 lg:gap-12 lg:py-14">
        <div className="lg:col-span-7">
          <h1 className="text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.95] font-extrabold tracking-[-0.02em] text-balance [font-stretch:72%]">
            {profile.name}
          </h1>
          <p className="mt-5 text-[1.25rem] font-bold [font-stretch:90%]">{profile.title}</p>
          <p className="mt-3 max-w-[38rem] text-[1.125rem] leading-[1.6] text-ds-ink-2">{profile.tagline}</p>

          <ul className="mt-8 flex flex-wrap gap-2">
            <Action href="/resume.pdf" primary download>
              <DownloadIcon className="text-[1rem]" />
              Download resume
              <span className="text-[0.75rem] font-bold opacity-80">PDF</span>
            </Action>
            <Action href={`mailto:${profile.email}`}>
              <MailIcon className="text-[1rem]" />
              Email
            </Action>
            <Action href={profile.linkedin} external>
              LinkedIn
              <ExternalIcon className="text-[0.875rem] text-ds-ink-3" />
            </Action>
            <Action href={profile.github} external>
              GitHub
              <ExternalIcon className="text-[0.875rem] text-ds-ink-3" />
            </Action>
            <Action href="#projects">
              Projects
              <ArrowDownIcon className="text-[0.875rem] text-ds-ink-3" />
            </Action>
          </ul>

          <table className="mt-10 w-full max-w-[38rem] border-collapse text-[0.9375rem]">
            <caption className="mb-2 text-left text-[0.8125rem] font-bold">Device information</caption>
            <tbody className="border-y border-ds-rule">
              <tr className="border-b border-ds-rule">
                <th scope="row" className="w-36 bg-ds-fill px-3 py-2 text-left text-[0.8125rem] font-semibold text-ds-ink-2">
                  Based in
                </th>
                <td className="px-3 py-2">{profile.location}</td>
              </tr>
              <tr className="border-b border-ds-rule">
                <th scope="row" className="bg-ds-fill px-3 py-2 text-left text-[0.8125rem] font-semibold text-ds-ink-2">
                  Working since
                </th>
                <td className="px-3 py-2 tabular-nums">{first}</td>
              </tr>
              <tr>
                <th scope="row" className="bg-ds-fill px-3 py-2 text-left text-[0.8125rem] font-semibold text-ds-ink-2">
                  Availability
                </th>
                <td className="px-3 py-2">Open to new opportunities</td>
              </tr>
            </tbody>
          </table>

          {/* The datasheet front page's Features list. */}
          <h2 className="mt-8 text-[0.8125rem] font-bold">Features</h2>
          <ul className="mt-2 grid max-w-[38rem] text-[0.9375rem] sm:grid-cols-2 sm:gap-x-8 [&>li:first-child]:border-t sm:[&>li:nth-child(2)]:border-t">
            {coreCompetencies.map((competency) => (
              <li key={competency} className="flex items-center gap-3 border-b border-ds-rule py-2">
                <span aria-hidden="true" className="size-2 shrink-0 bg-ds-accent" />
                {competency}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <StackDiagram />
        </div>
      </div>
    </section>
  )
}
