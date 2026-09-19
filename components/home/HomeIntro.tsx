'use client'

import { Suspense, useEffect, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'
import { ParticleText } from './ParticleText'
import { fadeOpacity } from './fadeOpacity'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useMediaQuery } from './useMediaQuery'
import { homeOneLiners, homeWordmarkName } from '@/data/content'
import { FADE_EDGE, ONE_LINER_RANGES, UNREACHABLE_RANGE, CTA_RANGE, SCROLL_PAGES } from './scrollTimeline'

const CTA_LABEL = 'View My Work'
const CTA_HREF = '/about'
const NARROW_VIEWPORT_QUERY = '(max-width: 639px)'

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
    <section className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-y-auto px-6 text-center">
      <h1 className="text-5xl font-bold text-emerald-400">CeeDev</h1>
      <p className="text-2xl font-bold text-emerald-200">{homeWordmarkName}</p>
      <div className="flex flex-col gap-2">
        {homeOneLiners.map((line) => (
          <p key={line} className="text-xl font-bold text-slate-200">
            {line}
          </p>
        ))}
      </div>
      <a
        href={CTA_HREF}
        className="rounded-md bg-[linear-gradient(90deg,#0f766e,#15803d)] px-5 py-3 text-white transition hover:brightness-110"
      >
        {CTA_LABEL}
      </a>
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
    el.classList.add('focus:outline-2', 'focus:outline-emerald-400', 'focus:outline-offset-[-2px]')

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
  children,
}: {
  offsetRef: { current: number }
  range: [number, number]
  hideWhenInvisible?: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frameId: number
    const tick = () => {
      if (ref.current) {
        const opacity = fadeOpacity(offsetRef.current, range[0], range[1], FADE_EDGE)
        ref.current.style.opacity = String(opacity)
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
  }, [offsetRef, range, hideWhenInvisible])

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
          {homeOneLiners.map((line, index) => (
            <FadingLine key={line} offsetRef={offsetRef} range={ONE_LINER_RANGES[index] ?? UNREACHABLE_RANGE}>
              <p className="text-balance text-center text-5xl leading-tight font-bold text-slate-100">{line}</p>
            </FadingLine>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-12 flex items-center justify-center px-6">
        <FadingLine offsetRef={offsetRef} range={CTA_RANGE} hideWhenInvisible>
          <a
            href={CTA_HREF}
            className="pointer-events-auto rounded-md bg-[linear-gradient(90deg,#0f766e,#15803d)] px-5 py-3 text-white transition hover:brightness-110"
          >
            {CTA_LABEL}
          </a>
        </FadingLine>
      </div>
    </div>
  )
}

export function HomeIntro() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isNarrowViewport = useMediaQuery(NARROW_VIEWPORT_QUERY)
  const showStatic = prefersReducedMotion || isNarrowViewport
  const offsetRef = useRef(0)

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

  if (showStatic) {
    return <StaticIntro />
  }

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
            <ParticleText />
          </Suspense>
          <ScrollOffsetBridge offsetRef={offsetRef} />
        </ScrollControls>
      </Canvas>
      <ScrollOverlay offsetRef={offsetRef} />
    </div>
  )
}
