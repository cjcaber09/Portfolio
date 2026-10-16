import Image from 'next/image'
import type { ProjectFigure as Figure } from '@/data/content'

// About 200px a screen from 640px (three across the featured entry's figure
// column, or across the sheet before it splits at lg); a third of the phone
// width below that.
const SCREEN_SIZES = '(min-width: 640px) 220px, 32vw'

// A project's real screenshots as a numbered datasheet figure, in the idiom of
// Figure 1 (the block diagram): hairline-framed screens, each named, under one
// caption. Every screen exists in both themes; the page shows the one matching
// its own theme, and the other stays display:none, so a lazily loaded image is
// never fetched. Each screen links to its full-size capture.
export function ProjectFigure({
  figure,
  number,
  title,
  id,
  className = '',
}: {
  figure: Figure
  number: number
  title: string
  id: string
  className?: string
}) {
  const captionId = `${id}-caption`
  return (
    <figure aria-labelledby={captionId} className={`m-0 ${className}`}>
      <ul className="grid grid-cols-3 gap-3 sm:gap-5">
        {figure.screens.map((screen) => (
          <li key={screen.name}>
            {(['light', 'dark'] as const).map((theme) => (
              <a
                key={theme}
                href={screen[theme]}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block ${theme === 'light' ? 'dark:hidden' : 'hidden dark:block'}`}
              >
                <Image
                  src={screen[theme]}
                  width={figure.width}
                  height={figure.height}
                  sizes={SCREEN_SIZES}
                  alt={screen.description}
                  className="h-auto w-full border border-ds-rule transition-colors duration-[120ms] group-hover:border-ds-ink"
                />
                <span className="sr-only">, full size, opens in a new tab</span>
              </a>
            ))}
            <p className="mt-2 text-[0.8125rem] font-semibold">{screen.name}</p>
          </li>
        ))}
      </ul>
      <figcaption id={captionId} className="mt-4 max-w-[65ch] text-[0.8125rem] leading-[1.6] text-ds-ink-2">
        <span className="font-bold text-ds-ink">Figure {number}.</span> {title}: {figure.caption}
      </figcaption>
    </figure>
  )
}
