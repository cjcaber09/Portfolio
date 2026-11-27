'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react'
import type { ProjectFigure, ProjectVideo } from '@/data/content'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, PlayIcon } from '../icons'
import {
  chapterSeconds,
  itemDescription,
  itemName,
  itemNumber,
  mediaItems,
  variants,
  type MediaItem,
} from './mediaItems'

// A horizontal drag this far (px) on the plate steps to the next or previous item.
const SWIPE_DISTANCE = 50

// The poster is the video's 1280 × 720 title card.
const POSTER = { width: 1280, height: 720 }

const control =
  'inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-[2px] border border-ds-rule px-3 text-[0.875rem] font-semibold text-ds-ink transition-colors duration-[120ms] hover:border-ds-ink'

const label = 'text-[0.6875rem] font-bold tracking-[0.06em] text-ds-ink-2 uppercase [font-stretch:85%]'

// A project figure's items, full size, over the page: a native modal dialog
// (focus held inside, Esc closes, focus returns to the control that opened
// it) on the night desk in both themes. It opens and closes at once, like
// everything on the sheet. Arrow keys, Home and End, the side buttons, a
// swipe, or the filmstrip move between items; a click on the empty desk
// around the item closes it. The demo video plays here, with its chapters.
export function MediaViewer({
  figure,
  number,
  title,
  index,
  onIndexChange,
  onClose,
}: {
  figure: ProjectFigure
  number: number
  title: string
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const swiped = useRef(false)
  const labelId = useId()
  const open = index !== null

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) {
      element.showModal()
      // The page behind stays where it is while the viewer is up.
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && element.open) {
      element.close()
    }
  }, [open])

  useEffect(() => () => void (document.documentElement.style.overflow = ''), [])

  const items = mediaItems(figure)
  const count = items.length

  function close() {
    dialog.current?.close()
  }

  function handleClose() {
    document.documentElement.style.overflow = ''
    onClose()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    // The video keeps its own arrow keys for seeking.
    if (index === null || (event.target as HTMLElement).tagName === 'VIDEO') return
    const target = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: count - 1 }[event.key]
    if (target === undefined) return
    event.preventDefault()
    onIndexChange((target + count) % count)
  }

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (swiped.current) {
      swiped.current = false
      return
    }
    const target = event.target as HTMLElement
    if (target === event.currentTarget || target.dataset.viewerEmpty !== undefined) close()
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={labelId}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className="media-viewer m-0 h-dvh max-h-none w-screen max-w-none grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto_auto] border-0 p-0 text-ds-ink open:grid max-sm:grid-rows-[auto_auto_auto_auto] max-sm:overflow-y-auto"
    >
      {index !== null && (
        <>
          <div className="flex items-center gap-4 border-b border-ds-rule bg-[var(--viewer-desk)] px-5 py-2.5 max-sm:sticky max-sm:top-0 max-sm:z-10 max-sm:px-3">
            <p id={labelId} className={`truncate ${label}`}>
              <span className="text-ds-accent">Figure {number}</span> · {title}
            </p>
            <p className="ml-auto text-[0.8125rem] whitespace-nowrap text-ds-ink-2 tabular-nums" aria-live="polite">
              {index + 1} / {count}
            </p>
            <button type="button" className={control} onClick={close}>
              Close
              <CloseIcon className="text-[0.875rem]" />
            </button>
          </div>

          <div
            data-viewer-empty
            className="grid min-h-0 cursor-zoom-out grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-5 max-sm:grid-cols-[minmax(0,1fr)] max-sm:p-3"
          >
            <button
              type="button"
              className={`${control} max-sm:hidden`}
              aria-label="Previous"
              onClick={() => onIndexChange((index - 1 + count) % count)}
            >
              <ArrowLeftIcon className="text-[1rem]" />
            </button>
            <Plate
              item={items[index]}
              figure={figure}
              onSwipe={(step) => {
                swiped.current = true
                onIndexChange((index + step + count) % count)
              }}
            />
            <button
              type="button"
              className={`${control} max-sm:hidden`}
              aria-label="Next"
              onClick={() => onIndexChange((index + 1) % count)}
            >
              <ArrowRightIcon className="text-[1rem]" />
            </button>
          </div>

          <p className="mx-auto max-w-[80ch] px-5 pb-3 text-center text-[0.875rem] leading-[1.55] text-ds-ink-2 max-sm:px-3 max-sm:text-left">
            <span className="mr-1.5 font-bold text-ds-accent tabular-nums">{itemNumber(number, index)}</span>
            <span className="font-bold text-ds-ink">{itemName(items[index])}</span> — {itemDescription(items[index])}
          </p>

          <ol
            aria-label={`Items in figure ${number}`}
            className="flex gap-2 overflow-x-auto border-t border-ds-rule px-5 pt-3 pb-4 max-sm:px-3 sm:justify-center"
          >
            {items.map((item, itemIndex) => (
              <li key={itemName(item)} className="shrink-0">
                <button
                  type="button"
                  aria-current={itemIndex === index}
                  aria-label={`${itemNumber(number, itemIndex)} ${itemName(item)}`}
                  onClick={() => onIndexChange(itemIndex)}
                  className="group relative block cursor-pointer border border-ds-rule transition-colors duration-[120ms] hover:border-ds-ink-2 aria-[current=true]:border-ds-accent"
                >
                  <Thumbnail item={item} figure={figure} />
                  <span className="absolute bottom-0 left-0 bg-[var(--viewer-desk)] px-1.5 py-0.5 text-[0.6875rem] font-bold text-ds-ink-2 tabular-nums group-aria-[current=true]:text-ds-accent">
                    {itemNumber(number, itemIndex)}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 hidden h-[3px] bg-ds-accent group-aria-[current=true]:block" />
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </dialog>
  )
}

function Plate({
  item,
  figure,
  onSwipe,
}: {
  item: MediaItem
  figure: ProjectFigure
  onSwipe: (step: number) => void
}) {
  const start = useRef<number | null>(null)

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    start.current = (event.target as HTMLElement).closest('video, [data-chapters]') ? null : event.clientX
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (start.current === null) return
    const distance = event.clientX - start.current
    start.current = null
    if (Math.abs(distance) > SWIPE_DISTANCE) onSwipe(distance < 0 ? 1 : -1)
  }

  return (
    <div
      data-viewer-empty
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="flex h-full min-h-0 touch-pan-y items-center justify-center max-sm:h-auto"
    >
      {item.kind === 'video' ? (
        <VideoPlate video={item.video} />
      ) : (
        variants(item.screen).map((variant) => (
          <Image
            key={variant.src}
            src={variant.src}
            alt={item.screen.description}
            width={figure.width}
            height={figure.height}
            sizes="90vw"
            // Shown because it was asked for. Lazy loading would also wait for
            // it to be laid out, and an unloaded image here has no size.
            loading="eager"
            draggable={false}
            className={`h-auto max-h-full w-auto max-w-full cursor-default border border-ds-rule bg-ds-paper object-contain select-none max-sm:max-h-[70dvh] ${variant.className}`}
          />
        ))
      )}
    </div>
  )
}

function VideoPlate({ video }: { video: ProjectVideo }) {
  const player = useRef<HTMLVideoElement>(null)
  const [chapter, setChapter] = useState(0)

  function handleTimeUpdate() {
    const time = player.current?.currentTime ?? 0
    setChapter(video.chapters.findLastIndex((entry) => time >= chapterSeconds(entry.time)))
  }

  function jumpTo(chapterIndex: number) {
    const element = player.current
    if (!element) return
    element.currentTime = chapterSeconds(video.chapters[chapterIndex].time)
    setChapter(chapterIndex)
    void element.play()
  }

  return (
    <div data-viewer-empty className="grid w-full items-center gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <video
        ref={player}
        controls
        playsInline
        preload="none"
        poster={video.poster}
        aria-label={video.description}
        onTimeUpdate={handleTimeUpdate}
        className="w-full cursor-default border border-ds-rule bg-black lg:max-h-[calc(100dvh-18rem)]"
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <div data-chapters className="cursor-default">
        <p className={`mb-2 ${label}`}>Chapters</p>
        <ol className="border-t border-ds-rule lg:max-h-[calc(100dvh-20rem)] lg:overflow-y-auto">
          {video.chapters.map((entry, chapterIndex) => (
            <li key={entry.time}>
              <button
                type="button"
                aria-current={chapterIndex === chapter}
                onClick={() => jumpTo(chapterIndex)}
                className="flex w-full cursor-pointer gap-3 border-b border-ds-rule px-2.5 py-2 text-left text-[0.8125rem] text-ds-ink-2 transition-colors duration-[120ms] hover:text-ds-ink focus-visible:outline-offset-[-2px] aria-[current=true]:bg-ds-paper aria-[current=true]:font-semibold aria-[current=true]:text-ds-ink"
              >
                <span className="min-w-[2.6rem] font-semibold text-ds-accent tabular-nums">{entry.time}</span>
                {entry.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function Thumbnail({ item, figure }: { item: MediaItem; figure: ProjectFigure }) {
  if (item.kind === 'video') {
    return (
      <>
        <Image
          src={item.video.poster}
          alt=""
          width={POSTER.width}
          height={POSTER.height}
          sizes="120px"
          loading="eager"
          className="block h-16 w-auto max-sm:h-13"
        />
        <span className="absolute inset-0 flex items-center justify-center text-[1rem] text-ds-ink">
          <PlayIcon />
        </span>
      </>
    )
  }
  return variants(item.screen).map((variant) => (
    <Image
      key={variant.src}
      src={variant.src}
      alt=""
      width={figure.width}
      height={figure.height}
      sizes="120px"
      loading="eager"
      className={`block h-16 w-auto object-cover object-top max-sm:h-13 ${variant.className}`}
    />
  ))
}
