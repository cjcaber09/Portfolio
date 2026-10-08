import type { ReactNode } from 'react'
import { profile } from '@/data/content'
import { DatasheetSection } from './about/DatasheetSection'
import { SECTION_NUMBER } from './about/sections'
import { DownloadIcon, ExternalIcon } from './icons'

// "https://github.com/cjcaber09" -> "github.com/cjcaber09": the handle a
// recruiter can read and copy, rather than a bare "GitHub".
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

function Row({ channel, children }: { channel: string; children: ReactNode }) {
  return (
    <tr className="border-b border-ds-rule">
      <th scope="row" className="w-36 bg-ds-fill px-3 py-2.5 text-left text-[0.8125rem] font-semibold text-ds-ink-2">
        {channel}
      </th>
      <td className="px-3 py-2.5">{children}</td>
    </tr>
  )
}

const link = 'inline-flex items-center gap-1.5 font-semibold text-ds-ink underline decoration-ds-rule hover:decoration-ds-ink'

// Contact as the datasheet's ordering information: every way to reach Carl in
// one table.
export function Contact() {
  const telHref = `tel:${profile.phone.replace(/\s+/g, '')}`

  return (
    <DatasheetSection id="contact" number={SECTION_NUMBER.contact} title="Contact">
      <p className="max-w-[60ch] text-[1.125rem] leading-[1.7] text-ds-ink-2">
        Feel free to reach out — I&apos;m open to new opportunities and collaborations.
      </p>
      <table className="mt-8 w-full max-w-[44rem] border-collapse text-[0.9375rem]">
        <tbody className="border-t border-ds-rule">
          <Row channel="Email">
            <a href={`mailto:${profile.email}`} className={link}>
              {profile.email}
            </a>
          </Row>
          <Row channel="Phone">
            <a href={telHref} className={`${link} tabular-nums`}>
              {profile.phone}
            </a>
          </Row>
          <Row channel="LinkedIn">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className={link}>
              {displayUrl(profile.linkedin)}
              <ExternalIcon className="text-[0.8125rem] text-ds-ink-3" />
            </a>
          </Row>
          <Row channel="GitHub">
            <a href={profile.github} target="_blank" rel="noreferrer" className={link}>
              {displayUrl(profile.github)}
              <ExternalIcon className="text-[0.8125rem] text-ds-ink-3" />
            </a>
          </Row>
          <Row channel="Résumé">
            <a href="/resume.pdf" download className={link}>
              <DownloadIcon className="text-[0.875rem] text-ds-accent" />
              Download resume (PDF)
            </a>
          </Row>
        </tbody>
      </table>
    </DatasheetSection>
  )
}
