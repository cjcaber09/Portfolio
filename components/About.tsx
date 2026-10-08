import { summary } from '@/data/content'
import { DatasheetSection } from './about/DatasheetSection'
import { SECTION_NUMBER } from './about/sections'

// The summary paragraph. The competencies it used to sit beside are now the
// front page's Features list, in the hero.
export function About() {
  return (
    <DatasheetSection id="about" number={SECTION_NUMBER.about} title="About">
      <p className="max-w-[65ch] text-[1.125rem] leading-[1.7]">{summary}</p>
    </DatasheetSection>
  )
}
