import Image from 'next/image'
import type { ProjectFigure as Figure, ProjectScreen } from '@/data/content'

// Phone screens sit three across: about 200px each from 640px (across the
// featured entry's figure column, or across the sheet before it splits at
// lg), a third of the phone width below that. Wide desktop screens sit two
// across from 640px, about 320px each, and one per row on a phone, where two
// across would leave them too small to read.
const LAYOUT = {
  portrait: { grid: 'grid-cols-3 gap-3 sm:gap-5', sizes: '(min-width: 640px) 220px, 32vw' },
  landscape: { grid: 'grid-cols-1 gap-5 sm:grid-cols-2', sizes: '(min-width: 640px) 340px, 92vw' },
}

// The capture to show for each theme: one image when the app was captured in
// one theme, or both, with CSS showing the one matching the page. The other
// stays display:none, so its lazily loaded image is never fetched.
function variants(screen: ProjectScreen) {
  return screen.srcDark
    ? [
        { src: screen.src, className: 'dark:hidden' },
        { src: screen.srcDark, className: 'hidden dark:block' },
      ]
    : [{ src: screen.src, className: '' }]
}

// A project's real screenshots as a numbered datasheet figure, in the idiom of
// Figure 1 (the block diagram): hairline-framed screens, each named, under one
// caption. Every screen is framed at the figure's shape, so a capture a few
// pixels taller is trimmed at the bottom rather than breaking the row. Each
// screen links to its full-size capture.
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
  const layout = figure.width > figure.height ? LAYOUT.landscape : LAYOUT.portrait
  return (
    <figure aria-labelledby={captionId} className={`m-0 ${className}`}>
      <ul className={`grid ${layout.grid}`}>
        {figure.screens.map((screen) => (
          <li key={screen.name}>
            {variants(screen).map((variant) => (
              <a
                key={variant.src}
                href={variant.src}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block ${variant.className}`}
              >
                <Image
                  src={variant.src}
                  width={figure.width}
                  height={figure.height}
                  sizes={layout.sizes}
                  alt={screen.description}
                  style={{ aspectRatio: `${figure.width} / ${figure.height}` }}
                  className="h-auto w-full border border-ds-rule object-cover object-top transition-colors duration-[120ms] group-hover:border-ds-ink"
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
