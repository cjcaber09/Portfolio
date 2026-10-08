import { skills, type SkillGroup } from '@/data/content'
import { DatasheetSection } from './about/DatasheetSection'
import { SECTION_NUMBER } from './about/sections'

const MAX_LEVEL = 10

// Splits the groups, in order, into two tables of roughly equal length so
// the characteristics read as two balanced columns on wide screens.
function splitInTwo(groups: SkillGroup[]): [SkillGroup[], SkillGroup[]] {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)
  let running = 0
  const cut = groups.findIndex((group) => {
    running += group.items.length
    return running >= total / 2
  })
  return [groups.slice(0, cut + 1), groups.slice(cut + 1)]
}

// Ten square cells, filled up to the rating. Decorative: the numeral in the
// same row is the value.
function Meter({ level }: { level: number }) {
  return (
    <span aria-hidden="true" className="flex gap-[2px]">
      {Array.from({ length: MAX_LEVEL }, (_, cell) => (
        <span key={cell} className={`size-2 ${cell < level ? 'bg-ds-accent' : 'bg-ds-cell-off'}`} />
      ))}
    </span>
  )
}

function CharacteristicsTable({ groups }: { groups: SkillGroup[] }) {
  return (
    <table className="w-full border-collapse text-[0.875rem]">
      <thead>
        <tr className="border-y border-ds-rule bg-ds-fill text-[0.6875rem] tracking-[0.06em] text-ds-ink-2 uppercase [font-stretch:85%]">
          <th scope="col" className="px-3 py-2 text-left font-bold">
            Skill
          </th>
          <th scope="col" className="px-3 py-2 text-right font-bold">
            Rating
          </th>
          <th scope="col" className="w-[7.5rem] px-3 py-2 text-left font-bold">
            0–{MAX_LEVEL}
          </th>
        </tr>
      </thead>
      {groups.map((group) => (
        <tbody key={group.category}>
          <tr>
            <th scope="colgroup" colSpan={3} className="px-3 pt-4 pb-1.5 text-left text-[0.8125rem] font-bold">
              {group.category}
            </th>
          </tr>
          {group.items.map((item) => (
            <tr key={item.name} className="border-b border-ds-rule">
              <th scope="row" className="px-3 py-1.5 text-left font-medium">
                {item.name}
              </th>
              <td className="px-3 py-1.5 text-right font-semibold tabular-nums">
                {item.level}
                <span className="font-normal text-ds-ink-3">/{MAX_LEVEL}</span>
              </td>
              <td className="px-3 py-1.5">
                <Meter level={item.level} />
              </td>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  )
}

export function Skills() {
  const [left, right] = splitInTwo(skills)
  return (
    <DatasheetSection id="skills" number={SECTION_NUMBER.skills} title="Skills">
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-2">
        <CharacteristicsTable groups={left} />
        <CharacteristicsTable groups={right} />
      </div>
      <p className="mt-6 text-[0.8125rem] text-ds-ink-2">
        <span className="font-bold text-ds-ink">Note:</span> ratings are self-assessed on a 0–{MAX_LEVEL} scale.
      </p>
    </DatasheetSection>
  )
}
