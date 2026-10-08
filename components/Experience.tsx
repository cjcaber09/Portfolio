import { experience, stackLayers } from '@/data/content'
import { ColumnHeads, DatasheetSection } from './about/DatasheetSection'
import { SECTION_NUMBER, entryNumber, roleAnchorId, techAnchorId } from './about/sections'
import { roleTechnologies } from './about/traceStack'

// Columns: number and dates, the role, and (from lg) the stack it shipped
// with. Below lg the stack drops under the bullets as an inline row.
const columns =
  'md:grid-cols-[11rem_minmax(0,1fr)] lg:grid-cols-[11rem_minmax(0,1fr)_11rem] xl:grid-cols-[11rem_38rem_minmax(0,1fr)]'

// Experience as a datasheet revision history: newest first, each role a
// numbered row the block diagram's trace can link straight to. One <li> and
// one <h3> (title and company together) per role. The stack column is the
// trace run backwards: each technology links to its pin in Figure 1.
export function Experience() {
  return (
    <DatasheetSection id="experience" number={SECTION_NUMBER.experience} title="Experience">
      <ColumnHeads
        columns={['No. · Dates', 'Role · Company', 'Stack']}
        className={`${columns} [&>span:nth-child(3)]:hidden lg:[&>span:nth-child(3)]:block`}
      />
      <ol>
        {experience.map((role, index) => {
          const stack = roleTechnologies(role, stackLayers)
          return (
            <li
              key={`${role.company}-${role.title}`}
              id={roleAnchorId(role)}
              className={`grid gap-y-2 border-b border-ds-rule py-5 md:py-6 ${columns}`}
            >
              <p className="flex gap-3 md:flex-col md:gap-1 md:px-3">
                <span className="font-bold text-ds-accent tabular-nums">{entryNumber('experience', index)}</span>
                <span className="text-[0.875rem] text-ds-ink-2 tabular-nums">{role.dates}</span>
              </p>
              <div className="md:px-3">
                <h3 className="text-[1.125rem] leading-snug font-bold">
                  <span className="block">{role.title}</span>
                  <span className="block font-semibold text-ds-ink-2">{role.company}</span>
                </h3>
                <ul className="mt-3 max-w-[70ch] space-y-1.5 text-[0.9375rem] leading-[1.6] text-ds-ink-2">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 bg-ds-ink-3" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {stack.length > 0 && (
                <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.8125rem] md:col-start-2 md:px-3 lg:col-start-3 lg:mt-0 lg:block">
                  <span aria-hidden="true" className="font-bold text-ds-ink-2 lg:hidden">
                    Stack
                  </span>
                  <ul aria-label="Stack" className="flex flex-wrap gap-x-4 gap-y-1 lg:flex-col lg:gap-y-1.5">
                    {stack.map((technology) => (
                      <li key={technology.name}>
                        <a
                          href={`#${techAnchorId(technology.name)}`}
                          className="group inline-flex items-center gap-1.5 font-semibold text-ds-ink no-underline"
                        >
                          <span
                            aria-hidden="true"
                            className="size-2 shrink-0 bg-ds-cell-off transition-colors duration-[120ms] group-hover:bg-ds-accent"
                          />
                          <span className="underline decoration-ds-rule group-hover:decoration-ds-ink">
                            {technology.name}
                          </span>
                          <span className="sr-only"> in Figure 1</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </DatasheetSection>
  )
}
