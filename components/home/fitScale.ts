import type { Bounds } from './particlePositions'

export interface Viewport {
  width: number
  height: number
}

export interface FitScaleOptions {
  margin: number
  maxWidthPx: number
  canvasWidthPx: number
}

export function fitScale(bounds: Bounds | null, viewport: Viewport, options: FitScaleOptions): number {
  const fallback = viewport.width / options.canvasWidthPx
  if (!bounds) return fallback

  const maxWidthWorld = (options.maxWidthPx / options.canvasWidthPx) * viewport.width
  const candidates: number[] = []

  if (bounds.width > 0) {
    candidates.push((viewport.width * (1 - options.margin)) / bounds.width)
    candidates.push(maxWidthWorld / bounds.width)
  }
  if (bounds.height > 0) {
    candidates.push((viewport.height * (1 - options.margin)) / bounds.height)
  }

  if (candidates.length === 0) return fallback
  return Math.min(...candidates)
}
