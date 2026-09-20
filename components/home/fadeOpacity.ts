export function fadeOpacity(offset: number, from: number, to: number, edge: number): number {
  if (offset <= from || offset >= to) return 0
  const fadeInEnd = from + edge
  const fadeOutStart = to - edge
  if (offset < fadeInEnd) return (offset - from) / edge
  if (offset > fadeOutStart) return (to - offset) / edge
  return 1
}

// Companion to fadeOpacity, over the same [from, to] window and edges: how far
// through its slide a scroll-linked element is. +1 means fully below its
// resting position (waiting to enter), 0 means at rest, -1 means fully above
// (already gone). Multiply by a pixel distance for a translateY.
//
// Entering eases out (fast, then settling into place); leaving eases in (slow,
// then accelerating away). Outside the window it holds +1 / -1 rather than 0 so
// the resting positions stay consistent while the element is invisible.
export function slideProgress(offset: number, from: number, to: number, edge: number): number {
  if (offset <= from) return 1
  if (offset >= to) return -1
  const fadeInEnd = from + edge
  const fadeOutStart = to - edge
  if (offset < fadeInEnd) {
    const p = (offset - from) / edge
    return (1 - p) ** 3
  }
  if (offset > fadeOutStart) {
    const q = (offset - fadeOutStart) / edge
    return -(q ** 3)
  }
  return 0
}
