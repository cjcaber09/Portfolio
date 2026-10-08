import type { ReactNode } from 'react'

// One numbered datasheet section: a heavy ink rule, then the heading. The
// number is aria-hidden so the heading's accessible name stays the plain
// section name ("Experience"), which is what nav links and tests address.
export function DatasheetSection({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="border-t-2 border-ds-ink px-5 pt-12 pb-14 sm:px-10 sm:pt-14 sm:pb-16">
      <h2 className="mb-8 flex items-baseline gap-3 text-[1.75rem] leading-tight font-extrabold tracking-[-0.015em] [font-stretch:82%]">
        <span aria-hidden="true" className="text-ds-accent tabular-nums">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

// The filled header strip datasheet tables open with. Used above lists laid
// out as tables (experience, education), where it labels the columns for
// sighted readers; each row's own markup carries the same facts for assistive
// technology, so the strip itself is aria-hidden.
export function ColumnHeads({ columns, className }: { columns: string[]; className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`hidden border-y border-ds-rule bg-ds-fill text-[0.6875rem] font-bold tracking-[0.06em] text-ds-ink-2 uppercase [font-stretch:85%] md:grid ${className}`}
    >
      {columns.map((column) => (
        <span key={column} className="px-3 py-2">
          {column}
        </span>
      ))}
    </div>
  )
}
