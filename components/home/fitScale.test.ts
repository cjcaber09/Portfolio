import { describe, it, expect } from 'vitest'
import { fitScale } from './fitScale'
import type { Bounds } from './particlePositions'

function makeBounds(width: number, height: number): Bounds {
  return { minX: 0, maxX: width, minY: 0, maxY: height, width, height, centerX: width / 2, centerY: height / 2 }
}

describe('fitScale', () => {
  it('fits width to the margin when width binds', () => {
    const bounds = makeBounds(100, 20)
    const scale = fitScale(bounds, { width: 1000, height: 500 }, { margin: 0.2, maxWidthPx: 1_000_000, canvasWidthPx: 1000 })
    // 1000 * 0.8 / 100 = 8; height candidate is 500*0.8/20=20; cap is effectively infinite
    expect(scale).toBeCloseTo(8, 10)
  })

  it('fits height to the margin when height binds on a short, wide viewport', () => {
    const bounds = makeBounds(10, 100)
    const scale = fitScale(bounds, { width: 1000, height: 200 }, { margin: 0.2, maxWidthPx: 1_000_000, canvasWidthPx: 1000 })
    // width candidate: 1000*0.8/10=80; height candidate: 200*0.8/100=1.6 (binds)
    expect(scale).toBeCloseTo(1.6, 10)
  })

  it('the pixel width cap binds on a large screen', () => {
    const bounds = makeBounds(100, 10)
    const scale = fitScale(bounds, { width: 100_000, height: 100_000 }, { margin: 0.2, maxWidthPx: 50, canvasWidthPx: 1000 })
    // maxWidthWorld = 50 * 100000 / 1000 = 5000; cap candidate = 5000/100 = 50
    // width candidate: 100000*0.8/100=800; height candidate: 100000*0.8/10=8000
    expect(scale).toBeCloseTo(50, 10)
  })

  it('a zero-height box (single row) is constrained by the width terms alone', () => {
    const bounds = makeBounds(50, 0)
    const scale = fitScale(bounds, { width: 1000, height: 1 }, { margin: 0.2, maxWidthPx: 1_000_000, canvasWidthPx: 1000 })
    // height=0 must not divide-by-zero or force scale to 0/Infinity; width candidate: 1000*0.8/50=16
    expect(scale).toBeCloseTo(16, 10)
  })

  it('a single point (zero width and height) falls back to a 1:1 raster-to-CSS-pixel mapping', () => {
    const bounds = makeBounds(0, 0)
    const scale = fitScale(bounds, { width: 1000, height: 500 }, { margin: 0.2, maxWidthPx: 1_000_000, canvasWidthPx: 2000 })
    expect(scale).toBeCloseTo(1000 / 2000, 10)
  })

  it('null bounds falls back to the same 1:1 mapping', () => {
    const scale = fitScale(null, { width: 1000, height: 500 }, { margin: 0.2, maxWidthPx: 1_000_000, canvasWidthPx: 2000 })
    expect(scale).toBeCloseTo(1000 / 2000, 10)
  })

  it('never returns Infinity or NaN for degenerate or extreme inputs', () => {
    const cases: Array<[Bounds | null, { width: number; height: number }]> = [
      [makeBounds(0, 0), { width: 0, height: 0 }],
      [makeBounds(1000, 1000), { width: 1, height: 1 }],
      [null, { width: 1, height: 1 }],
    ]
    for (const [bounds, viewport] of cases) {
      const scale = fitScale(bounds, viewport, { margin: 0.2, maxWidthPx: 960, canvasWidthPx: 1 })
      expect(Number.isFinite(scale)).toBe(true)
    }
  })
})
