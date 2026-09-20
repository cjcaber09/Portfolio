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

// The "scroll" icon at the bottom of the first screen. Visible on the very
// first frame (`from = -1`, unreachable, for the same reason as
// WORDMARK_RANGE), then gone after only a little scrolling: a hint has done
// its job once the visitor has started. It is hidden long before the first
// one-liner begins at ONE_LINER_RANGES[0][0], and never returns.
export const SCROLL_HINT_RANGE: [number, number] = [-1, 0.1]

// drei's ScrollControls scroll track holds two stacked elements: a sticky
// "fixed" pane (one container-height, in normal flow before it starts
// sticking) plus a "fill" spacer sized to `pages * 100%`. Scroll threshold
// = (containerHeight + pages*containerHeight) - containerHeight =
// pages*containerHeight, so offset 0->1 spans exactly `pages`
// container-heights — not `pages - 1`, as an earlier revision of this
// constant assumed. Verified directly in a real browser: at pages=5 the
// scroll element measured clientHeight=346, scrollHeight=2076, giving a
// threshold of 1730 = 5 * 346 exactly. 4 pages -> 4 heights of scrolling,
// matching every pacing figure documented against this constant.
export const SCROLL_PAGES = 4
