'use client'

import { Suspense, useEffect, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { ParticleText } from './ParticleText'
import { fadeOpacity } from './fadeOpacity'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { homeOneLiners } from '@/data/content'

const CTA_LABEL = 'View My Work'
const CTA_HREF = '/about'
const FADE_EDGE = 0.06
const ONE_LINER_RANGES: Array<[number, number]> = [
  [0.4, 0.58],
  [0.55, 0.73],
  [0.7, 0.88],
]
// Upper bound set safely beyond the reachable [0,1] scroll range. fadeOpacity
// treats `to` as exclusive (offset >= to returns 0), so a CTA_RANGE of
// [0.85, 1] would make the button fade back to invisible exactly at max
// scroll (offset === 1) — the one moment it must stay visible/clickable.
// [0.85, 2] fades it in once, starting at offset 0.85, and then holds it at
// full opacity for the rest of the reachable range since offset can never
// reach the fade-out zone near 2.
const CTA_RANGE: [number, number] = [0.85, 2]

function StaticIntro() {
  return (
    <section className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-5xl font-bold text-emerald-400">CeeDev</h1>
      <div className="flex flex-col gap-2">
        {homeOneLiners.map((line) => (
          <p key={line} className="text-lg text-slate-200">
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

function FadingLine({ range, children }: { range: [number, number]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = useScroll()

  useFrame(() => {
    if (!ref.current) return
    const opacity = fadeOpacity(scroll.offset, range[0], range[1], FADE_EDGE)
    ref.current.style.opacity = String(opacity)
  })

  return (
    <div ref={ref} className="absolute inset-x-0 flex justify-center" style={{ opacity: 0 }}>
      {children}
    </div>
  )
}

function ScrollOverlay() {
  return (
    <Scroll html style={{ width: '100%' }}>
      <div className="relative h-[400vh] w-full">
        <div className="sticky top-0 flex h-dvh w-full items-center justify-center">
          {homeOneLiners.map((line, index) => (
            <FadingLine key={line} range={ONE_LINER_RANGES[index]}>
              <p className="text-lg text-slate-200">{line}</p>
            </FadingLine>
          ))}
          <FadingLine range={CTA_RANGE}>
            <a
              href={CTA_HREF}
              className="pointer-events-auto rounded-md bg-[linear-gradient(90deg,#0f766e,#15803d)] px-5 py-3 text-white transition hover:brightness-110"
            >
              {CTA_LABEL}
            </a>
          </FadingLine>
        </div>
      </div>
    </Scroll>
  )
}

export function HomeIntro() {
  const prefersReducedMotion = usePrefersReducedMotion()

  // Nudge react-use-measure (used internally by Canvas for sizing) to
  // re-measure shortly after mount. Canvas is loaded via a client-only
  // dynamic import (Task 6), which can resolve and mount before its
  // container's final layout size is committed; the first ResizeObserver
  // callback can then report the browser's default 300x150 canvas size and
  // never fire again on its own. react-use-measure also listens for
  // window 'resize' events as an additional remeasure trigger — dispatching
  // one manually reliably corrects the size. Verified by manual testing:
  // without this, the canvas stays stuck at 300x150 until the browser
  // window is actually resized.
  useEffect(() => {
    if (prefersReducedMotion) return
    const id = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    return () => window.clearTimeout(id)
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return <StaticIntro />
  }

  return (
    <div className="h-dvh w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ScrollControls pages={4} damping={0.2}>
          <Suspense fallback={null}>
            <ParticleText />
          </Suspense>
          <ScrollOverlay />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
