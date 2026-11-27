'use client'

import Image from 'next/image'
import { useState, type CSSProperties } from 'react'
import type { ProjectFigure as Figure } from '@/data/content'
import { ExpandIcon, PlayIcon } from '../icons'
import { useOpenMedia } from './ProjectMedia'
import { isPortrait, itemName, itemNumber, mediaItems, variants } from './mediaItems'

// The video's poster, its 1280 × 720 title card.
const POSTER = { width: 1280, height: 720 }

// A project's real screenshots (and demo video) as a numbered datasheet
// figure, in the idiom of Figure 1: hairline-framed, every item numbered and
// named, under one caption. Phone screens sit three across. Wide desktop
// captures share one large stage with a numbered index under it, which swaps
// what the stage shows. Any screen, or the stage, opens the media viewer.
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
      {isPortrait(figure) ? <PhoneScreens figure={figure} number={number} /> : <Stage figure={figure} number={number} />}
      <figcaption id={captionId} className="mt-4 max-w-[65ch] text-[0.8125rem] leading-[1.6] text-ds-ink-2">
        <span className="font-bold text-ds-ink">Figure {number}.</span> {title}: {figure.caption}
      </figcaption>
    </figure>
  )
}

// Phone screens, about 200px each from 640px and a third of the phone below.
function PhoneScreens({ figure, number }: { figure: Figure; number: number }) {
  const open = useOpenMedia()
  return (
    <ul className="grid grid-cols-3 gap-3 sm:gap-5">
      {figure.screens.map((screen, index) => (
        <li key={screen.name}>
          <button type="button" onClick={() => open(index)} className="group block w-full cursor-zoom-in">
            {variants(screen).map((variant) => (
              <Image
                key={variant.src}
                src={variant.src}
                width={figure.width}
                height={figure.height}
                sizes="(min-width: 640px) 220px, 32vw"
                alt={screen.description}
                style={{ aspectRatio: `${figure.width} / ${figure.height}` }}
                className={`h-auto w-full border border-ds-rule object-cover object-top transition-colors duration-[120ms] group-hover:border-ds-ink ${variant.className}`}
              />
            ))}
            <span className="sr-only">, open in the viewer</span>
          </button>
          <p className="mt-2 text-[0.8125rem] font-semibold">
            <span className="mr-1.5 text-ds-accent tabular-nums">{itemNumber(number, index)}</span>
            <span>{screen.name}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}

// One large stage at the figure's shape, and a numbered index of every item
// under it: two across on a phone, all in one row from 640px.
function Stage({ figure, number }: { figure: Figure; number: number }) {
  const open = useOpenMedia()
  const items = mediaItems(figure)
  const [current, setCurrent] = useState(0)
  const item = items[current]

  return (
    <>
      <button
        type="button"
        onClick={() => open(current)}
        style={{ aspectRatio: `${figure.width} / ${figure.height}` }}
        className="group relative block w-full cursor-zoom-in overflow-hidden border border-ds-rule bg-ds-fill transition-colors duration-[120ms] hover:border-ds-ink"
      >
        {item.kind === 'screen' ? (
          variants(item.screen).map((variant) => (
            <Image
              key={variant.src}
              src={variant.src}
              width={figure.width}
              height={figure.height}
              sizes="(min-width: 1024px) 680px, 92vw"
              alt={item.screen.description}
              className={`block h-full w-full object-cover object-top ${variant.className}`}
            />
          ))
        ) : (
          <>
            <Image
              src={item.video.poster}
              width={POSTER.width}
              height={POSTER.height}
              sizes="(min-width: 1024px) 680px, 92vw"
              alt={item.video.description}
              className="block h-full w-full object-cover"
            />
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-[2px] bg-ds-accent text-[1.375rem] text-ds-accent-ink">
                <PlayIcon />
              </span>
            </span>
          </>
        )}
        <span
          aria-hidden="true"
          className="absolute right-2 bottom-2 inline-flex h-7 items-center gap-1.5 rounded-[2px] border border-ds-rule bg-ds-paper px-2 text-[0.75rem] font-semibold text-ds-ink"
        >
          {item.kind === 'video' ? <PlayIcon /> : <ExpandIcon />}
          {item.kind === 'video' ? 'Play in viewer' : 'Open viewer'}
        </span>
        <span className="sr-only">, open in the viewer</span>
      </button>

      <ol
        aria-label={`Items in figure ${number}`}
        style={{ '--items': items.length } as CSSProperties}
        className="grid grid-cols-2 border-t border-ds-rule sm:[grid-template-columns:repeat(var(--items),minmax(0,1fr))]"
      >
        {items.map((entry, index) => (
          <li key={itemName(entry)} className="flex">
            <button
              type="button"
              aria-pressed={index === current}
              onClick={() => setCurrent(index)}
              className="-mt-px flex-1 cursor-pointer border-t-2 border-b border-t-transparent border-b-ds-rule px-2.5 pt-2 pb-2.5 text-left text-[0.8125rem] leading-[1.35] text-ds-ink-2 transition-colors duration-[120ms] hover:text-ds-ink focus-visible:outline-offset-[-2px] aria-pressed:border-t-ds-accent aria-pressed:text-ds-ink"
            >
              <span className="block text-[0.75rem] font-bold text-ds-accent tabular-nums">{itemNumber(number, index)}</span>
              <span className="font-semibold">{itemName(entry)}</span>
              {entry.kind === 'video' && (
                <span className="mt-0.5 flex items-center gap-1 text-ds-ink-3 tabular-nums">
                  <PlayIcon className="text-[0.6875rem]" />
                  {entry.video.duration}
                </span>
              )}
            </button>
          </li>
        ))}
      </ol>
    </>
  )
}
