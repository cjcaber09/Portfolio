'use client'

import { Suspense, useEffect, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'
import { ParticleText } from './ParticleText'
import { fadeOpacity, slideProgress } from './fadeOpacity'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useMediaQuery } from './useMediaQuery'
import { homeOneLiners, homeWordmarkName } from '@/data/content'
import { useTheme } from '@/components/ThemeProvider'
import { actionPrimary } from '@/components/actions'
import { ArrowRightIcon } from '@/components/icons'
import {
  FADE_EDGE,
  ONE_LINER_RANGES,
  UNREACHABLE_RANGE,
  CTA_RANGE,
  SCROLL_HINT_RANGE,
  SCROLL_PAGES,
} from './scrollTimeline'

const CTA_LABEL = 'View My Work'
const CTA_HREF = '/about'
const NARROW_VIEWPORT_QUERY = '(max-width: 639px)'
// How far a scroll sentence travels while it enters and leaves. Sized for the
// headline text; a presentation value, so it lives here rather than in
// scrollTimeline.ts (which holds only scroll-offset ranges).
const SLIDE_DISTANCE_PX = 40

// The one-liners are set like the datasheet's display line (DESIGN.md): Archivo
// at 800, condensed to 72%, solid ink, with the supporting line in ink-2. Both
// colours are `ds` tokens, so they follow the theme with the rest of the sheet.
// 52px, 72px from `lg`: the condensed cut runs narrow enough that the longest
// line balances onto two lines at the 768px canvas widths rather than three.
const HEADLINE =
  'text-balance text-[3.25rem] leading-[0.95] font-extrabold tracking-[-0.02em] text-ds-ink [font-stretch:72%] lg:text-[4.5rem]'
const SUPPORT = 'max-w-[38rem] text-balance text-[1.125rem] leading-[1.6] text-ds-ink-2 md:text-[1.25rem]'

function CallToAction({ className = '' }: { className?: string }) {
  return (
    <a href={CTA_HREF} className={`${actionPrimary} ${className}`}>
      {CTA_LABEL}
      <ArrowRightIcon className="text-[1rem]" />
    </a>
  )
}

// The cover without the canvas, for reduced motion and phones: the same facts
// as the animated path, set as the top of a datasheet page. The brand square
// and CeeDev in the display cut, the name, the one-liners as ruled rows, and
// the primary action. Being sheet content, it sits on the sheet the way /about
// does: paper edge to edge below 640px, and from 640px a hairline-bordered
// paper sheet on the desk with /about's margins.
function StaticIntro() {
  // absolute inset-0 (not min-h-full): this renders inside app/page.tsx's
  // `relative min-h-0 flex-1` wrapper, whose own `height` CSS property is
  // `auto` even though flex-grow gives it a definite *rendered* size.
  // Percentage heights (min-h-full = min-height:100%) only resolve against
  // a parent whose `height` property is itself non-auto — verified by
  // forcing `height:100%` inline on this element in a real browser and
  // finding it did nothing, while a literal pixel height worked instantly.
  // Absolute positioning sizes against the parent's actual rendered box
  // instead, sidestepping that rule. overflow-y-auto (rather than growing
  // the page) lets content taller than the available space scroll within
  // this box on short phones, without either bug returning.
  return (
    <section className="absolute inset-0 overflow-y-auto sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-full max-w-[75rem] bg-ds-paper sm:border sm:border-ds-rule">
        <div className="mx-auto flex w-full max-w-[40rem] flex-col justify-center px-5 py-10 sm:px-10">
          <h1 className="flex items-center gap-3 text-[3.25rem] leading-[0.95] font-extrabold tracking-[-0.02em] [font-stretch:72%]">
            <span aria-hidden="true" className="size-[0.28em] shrink-0 bg-ds-accent" />
            CeeDev
          </h1>
          <p className="mt-3 text-[1.25rem] font-bold text-ds-ink-2 [font-stretch:90%]">{homeWordmarkName}</p>
          <ul className="mt-8 border-t border-ds-rule">
            {homeOneLiners.map(({ title, description }) => (
              <li key={title} className="border-b border-ds-rule py-4">
                <p className="text-[1.125rem] leading-snug font-bold">{title}</p>
                <p className="mt-1 text-[0.9375rem] leading-[1.6] text-ds-ink-2">{description}</p>
              </li>
            ))}
          </ul>
          <CallToAction className="mt-8 self-start" />
        </div>
      </div>
    </section>
  )
}

// Runs inside <ScrollControls>, where useScroll() is available. It mirrors
// the live scroll offset into a plain ref every frame (read outside the
// Canvas via requestAnimationFrame, rather than drei's <Scroll html> — see
// the 2026-09-18 design's root-cause note on why that component was
// removed) and, once, makes the scroll element itself keyboard-operable.
// It must do the latter here: `scroll.el` is a plain DOM node, but only
// this component (a descendant of <ScrollControls>) has it via useScroll().
function ScrollOffsetBridge({ offsetRef }: { offsetRef: { current: number } }) {
  const scroll = useScroll()

  useEffect(() => {
    // scroll.el is a real DOM node drei creates and exposes specifically
    // for this kind of imperative use (it's the same element <Scroll html>
    // used to render into) — not application state the hook owns, so
    // mutating its DOM properties here is intentional, not a hook-purity
    // violation the eslint rule below is meant to catch.
    //
    // The document itself no longer scrolls on the animated path (see
    // app/page.tsx), and the CTA is inert until it's visible, so this
    // element is the only thing left that keyboard users can reach to
    // drive the animation. It has no tabIndex by default.
    const el = scroll.el
    // eslint-disable-next-line react-hooks/immutability -- see comment above
    el.tabIndex = 0
    el.setAttribute('aria-label', 'Scroll to reveal introduction')
    // intro-scroll (app/globals.css): transparent scrollbar track, faint
    // thumb, and the sheet's green focus ring drawn inside the edge. The ring
    // is keyboard-only (:focus-visible): the element is focusable so keyboard
    // users can drive the animation, which means a plain mouse click on the
    // intro also focuses it, and a ring round the whole screen on every click
    // would be noise.
    el.classList.add('intro-scroll')

    // Unlike a <textarea> or the document itself, a generic
    // tabindex="0" overflow:auto <div> does not reliably get free
    // arrow-key/Page-Down/Space scrolling from the browser just by being
    // focused — verified directly (including via a genuinely dispatched
    // KeyboardEvent, not just this project's own automated test tool) that
    // it does not fire here. Wired explicitly rather than assumed.
    function handleKeyDown(event: KeyboardEvent) {
      const arrowStep = el.clientHeight * 0.2
      const pageStep = el.clientHeight
      if (event.key === 'ArrowDown') {
        el.scrollTop += arrowStep
      } else if (event.key === 'ArrowUp') {
        el.scrollTop -= arrowStep
      } else if (event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)) {
        el.scrollTop += pageStep
      } else if (event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)) {
        el.scrollTop -= pageStep
      } else if (event.key === 'Home') {
        el.scrollTop = 0
      } else if (event.key === 'End') {
        el.scrollTop = el.scrollHeight
      } else {
        return
      }
      event.preventDefault()
    }

    el.addEventListener('keydown', handleKeyDown)
    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [scroll.el])

  useFrame(() => {
    offsetRef.current = scroll.offset
  })
  return null
}

function FadingLine({
  offsetRef,
  range,
  hideWhenInvisible,
  slidePx,
  children,
}: {
  offsetRef: { current: number }
  range: [number, number]
  hideWhenInvisible?: boolean
  // When set, the line also slides vertically by up to this many pixels:
  // rising into place as it fades in, drifting upward as it fades out.
  slidePx?: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frameId: number
    const tick = () => {
      if (ref.current) {
        const opacity = fadeOpacity(offsetRef.current, range[0], range[1], FADE_EDGE)
        ref.current.style.opacity = String(opacity)
        if (slidePx) {
          const slide = slideProgress(offsetRef.current, range[0], range[1], FADE_EDGE)
          ref.current.style.transform = `translateY(${slide * slidePx}px)`
        }
        // The CTA link is interactive: while invisible it must not be
        // clickable, focusable, or able to swallow wheel/scroll input.
        // opacity:0 alone hides it visually but leaves all of that intact.
        // The sentences don't get this — they are pointer-events-none and
        // not focusable, and should stay in the accessibility tree at
        // every scroll position.
        if (hideWhenInvisible) {
          ref.current.style.visibility = opacity > 0 ? 'visible' : 'hidden'
        }
      }
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [offsetRef, range, hideWhenInvisible, slidePx])

  return (
    <div
      ref={ref}
      className="absolute inset-x-0 flex justify-center"
      style={{ opacity: 0, visibility: hideWhenInvisible ? 'hidden' : undefined }}
    >
      {children}
    </div>
  )
}

// A small mouse with a wheel that drifts down: "scroll to begin". Decorative
// only (aria-hidden): the scroll area itself is labelled and keyboard-operable
// (see ScrollOffsetBridge), so this adds nothing for assistive technology.
function ScrollHintIcon() {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="38"
      viewBox="0 0 24 38"
      fill="none"
      className="text-ds-ink-3"
    >
      <rect x="1.5" y="1.5" width="21" height="35" rx="10.5" stroke="currentColor" strokeWidth="1.5" />
      <circle className="scroll-hint-wheel" cx="12" cy="11" r="2.5" fill="currentColor" />
    </svg>
  )
}

function ScrollOverlay({ offsetRef }: { offsetRef: { current: number } }) {
  // Two separate absolutely-positioned regions, not one flex column with a
  // gap between the sentences and the CTA. Every FadingLine is itself
  // `position: absolute`, and per the flexbox spec an absolutely-positioned
  // flex child computes its static position "as if it were the sole flex
  // item" in its containing flex box — meaning a shared `flex-col ...
  // gap-8` parent does NOT stack them with a gap; each one centers itself
  // independently in the parent's full box, regardless of siblings. Found
  // by screenshot: the CTA rendered dead-centre on top of the third
  // sentence rather than below it. Giving the sentences and the CTA their
  // own separate, non-overlapping absolutely-positioned regions (each
  // still using the same flex items-center justify-center + abspos-child
  // trick, just scoped to its own box) makes the overlap structurally
  // impossible instead of relying on a gap that abspos children ignore.
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 bottom-28 flex items-center justify-center px-6">
        <div className="relative flex w-full max-w-5xl items-center justify-center">
          {homeOneLiners.map(({ title, description }, index) => (
            <FadingLine
              key={title}
              offsetRef={offsetRef}
              range={ONE_LINER_RANGES[index] ?? UNREACHABLE_RANGE}
              slidePx={SLIDE_DISTANCE_PX}
            >
              <div className="flex flex-col items-center gap-5 text-center">
                <p className={HEADLINE}>{title}</p>
                <p className={SUPPORT}>{description}</p>
              </div>
            </FadingLine>
          ))}
        </div>
      </div>
      {/* Same centre line as the CTA below, but they are never on screen
          together: the hint is gone by offset 0.1, the CTA arrives at 0.84.
          The wrapper is a zero-height line (its only child is absolutely
          positioned), so the icon centres ON bottom-12, leaving roughly a
          30px gap under the 38px icon — bottom-6 left only 5px. */}
      <div className="absolute inset-x-0 bottom-12 flex items-center justify-center px-6">
        <FadingLine offsetRef={offsetRef} range={SCROLL_HINT_RANGE}>
          <ScrollHintIcon />
        </FadingLine>
      </div>
      <div className="absolute inset-x-0 bottom-12 flex items-center justify-center px-6">
        <FadingLine offsetRef={offsetRef} range={CTA_RANGE} hideWhenInvisible>
          <CallToAction className="pointer-events-auto" />
        </FadingLine>
      </div>
    </div>
  )
}

// The canvas path. It reads the site theme (the static path has no need to),
// so the dots are drawn in the contribution ramp for the desk that's showing.
function AnimatedIntro() {
  const { theme } = useTheme()
  const offsetRef = useRef(0)

  return (
    // absolute inset-0, not h-full: see the comment on StaticIntro's root
    // above for why a percentage-height class silently fails to fill this
    // same flex-1 parent.
    <div className="absolute inset-0 overflow-hidden">
      {/* Neither "CeeDev" nor the name exist as real text on the canvas
          path — they're pixels sampled onto instanced WebGL circles. This
          is their screen-reader-accessible equivalent, matching
          StaticIntro's visible <h1> + name. The name is a SIBLING of the
          h1, never nested inside it: nesting it would change the heading's
          accessible name to "CeeDev Carl John Caber" and break the two
          tests (here and in app/page.test.tsx) that match it exactly. */}
      <h1 className="sr-only">CeeDev</h1>
      <p className="sr-only">{homeWordmarkName}</p>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ScrollControls pages={SCROLL_PAGES} damping={0.2}>
          <Suspense fallback={null}>
            <ParticleText dark={theme === 'dark'} />
          </Suspense>
          <ScrollOffsetBridge offsetRef={offsetRef} />
        </ScrollControls>
      </Canvas>
      <ScrollOverlay offsetRef={offsetRef} />
    </div>
  )
}

export function HomeIntro() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isNarrowViewport = useMediaQuery(NARROW_VIEWPORT_QUERY)
  const showStatic = prefersReducedMotion || isNarrowViewport

  // Nudge react-use-measure (used internally by Canvas for sizing) to
  // re-measure shortly after mount. Canvas is loaded via a client-only
  // dynamic import, which can resolve and mount before its container's
  // final layout size is committed; the first ResizeObserver callback can
  // then report the browser's default 300x150 canvas size and never fire
  // again on its own. This must key on the SAME condition that decides
  // whether the Canvas renders at all: crossing the narrow-viewport
  // breakpoint upward (e.g. rotating a phone from portrait to landscape)
  // now also mounts a fresh Canvas, and without this effect re-running for
  // that case too, that path reproduces the same 300x150 bug.
  useEffect(() => {
    if (showStatic) return
    const id = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    return () => window.clearTimeout(id)
  }, [showStatic])

  return showStatic ? <StaticIntro /> : <AnimatedIntro />
}
