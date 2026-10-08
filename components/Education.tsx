import { education } from '@/data/content'
import { ColumnHeads, DatasheetSection } from './about/DatasheetSection'
import { SECTION_NUMBER } from './about/sections'

export function Education() {
  return (
    <DatasheetSection id="education" number={SECTION_NUMBER.education} title="Education">
      <ColumnHeads columns={['Period', 'Level', 'Institution']} className="grid-cols-[11rem_9rem_1fr]" />
      <ol>
        {education.map((entry) => (
          <li
            key={`${entry.school}-${entry.level}`}
            className="grid gap-1 border-b border-ds-rule py-4 md:grid-cols-[11rem_9rem_1fr] md:gap-0"
          >
            <span className="text-[0.875rem] text-ds-ink-2 tabular-nums md:px-3">{entry.dates}</span>
            <span className="text-[0.875rem] font-semibold md:px-3">{entry.level}</span>
            <div className="md:px-3">
              <h3 className="text-[1rem] font-bold">{entry.school}</h3>
              {entry.degree && <p className="mt-0.5 text-[0.9375rem]">{entry.degree}</p>}
              {entry.location && <p className="mt-0.5 text-[0.875rem] text-ds-ink-2">{entry.location}</p>}
            </div>
          </li>
        ))}
      </ol>
    </DatasheetSection>
  )
}
