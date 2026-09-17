export function fadeOpacity(offset: number, from: number, to: number, edge: number): number {
  if (offset <= from || offset >= to) return 0
  const fadeInEnd = from + edge
  const fadeOutStart = to - edge
  if (offset < fadeInEnd) return (offset - from) / edge
  if (offset > fadeOutStart) return (to - offset) / edge
  return 1
}
