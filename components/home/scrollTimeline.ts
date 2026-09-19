// Every scroll-offset constant for the Home intro lives here, because the
// wordmark (faded inside ParticleText, which runs inside the Canvas) and
// the one-liners/CTA (faded in HomeIntro, outside the Canvas) must never
// overlap — see the "handoff invariant" test in scrollTimeline.test.ts.
// A retune made in only one of those two components is how a future
// change reintroduces overlap.

export const FADE_EDGE = 0.06

// fadeOpacity treats `from` as exclusive-below (offset <= from returns 0).
// A `from` of 0 would make the wordmark invisible on the one frame it must
// be visible (offset === 0). -1 puts the fade-in edge at -0.94, unreachable,
// so offset 0 always sits on the plateau.
export const WORDMARK_RANGE: [number, number] = [-1, 0.32]

// Position (not opacity) assembly range for "Carl John Caber".
export const NAME_ASSEMBLY_END = 0.2

export const ONE_LINER_RANGES: Array<[number, number]> = [
  [0.34, 0.54],
  [0.56, 0.76],
  [0.78, 2],
]

// fadeOpacity(offset, 1, 1, edge) is 0 for every offset in the reachable
// [0, 1] range — a safe fallback if ONE_LINER_RANGES[index] is ever
// undefined, rather than a crash.
export const UNREACHABLE_RANGE: [number, number] = [1, 1]

// fadeOpacity treats `to` as exclusive (offset >= to returns 0), so a
// range ending at 1 would fade the CTA back out exactly at max scroll.
export const CTA_RANGE: [number, number] = [0.84, 2]

// drei's ScrollControls makes offset 0->1 span (pages - 1) heights of the
// intro area. 5 pages = 4 heights of scrolling across the full track.
export const SCROLL_PAGES = 5
