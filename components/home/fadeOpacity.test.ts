import { describe, it, expect } from 'vitest'
import { fadeOpacity, slideProgress } from './fadeOpacity'

describe('fadeOpacity', () => {
  it('is 0 before the range starts', () => {
    expect(fadeOpacity(0.1, 0.4, 0.6, 0.05)).toBe(0)
  })

  it('is 0 after the range ends', () => {
    expect(fadeOpacity(0.7, 0.4, 0.6, 0.05)).toBe(0)
  })

  it('is 1 in the plateau between the fade-in and fade-out edges', () => {
    expect(fadeOpacity(0.5, 0.4, 0.6, 0.05)).toBe(1)
  })

  it('fades in linearly across the leading edge', () => {
    expect(fadeOpacity(0.4, 0.4, 0.6, 0.05)).toBe(0)
    expect(fadeOpacity(0.425, 0.4, 0.6, 0.05)).toBeCloseTo(0.5, 5)
    expect(fadeOpacity(0.45, 0.4, 0.6, 0.05)).toBe(1)
  })

  it('fades out linearly across the trailing edge', () => {
    // NOTE: 0.6 - 0.05 is not exactly 0.55 in IEEE 754 floating point, so this
    // boundary uses toBeCloseTo rather than toBe.
    expect(fadeOpacity(0.55, 0.4, 0.6, 0.05)).toBeCloseTo(1, 10)
    expect(fadeOpacity(0.575, 0.4, 0.6, 0.05)).toBeCloseTo(0.5, 5)
    expect(fadeOpacity(0.6, 0.4, 0.6, 0.05)).toBe(0)
  })
})

describe('slideProgress', () => {
  // Same range as the fadeOpacity tests: enters over [0.4, 0.45], plateau
  // until 0.55, exits over [0.55, 0.6].
  it('is 1 (waiting below) at and before the start of the range', () => {
    expect(slideProgress(0.1, 0.4, 0.6, 0.05)).toBe(1)
    expect(slideProgress(0.4, 0.4, 0.6, 0.05)).toBe(1)
  })

  it('is -1 (already gone above) at and after the end of the range', () => {
    expect(slideProgress(0.6, 0.4, 0.6, 0.05)).toBe(-1)
    expect(slideProgress(0.7, 0.4, 0.6, 0.05)).toBe(-1)
  })

  it('is 0 in the plateau', () => {
    expect(slideProgress(0.5, 0.4, 0.6, 0.05)).toBe(0)
  })

  it('eases out into place across the leading edge (fast at first, settling at the end)', () => {
    // Halfway through the edge (p = 0.5) the remaining offset is (1 - p)^3 = 0.125,
    // so the text has covered 87.5% of the travel in the first half of the edge.
    expect(slideProgress(0.425, 0.4, 0.6, 0.05)).toBeCloseTo(0.125, 5)
    expect(slideProgress(0.45, 0.4, 0.6, 0.05)).toBeCloseTo(0, 10)
  })

  it('eases in away across the trailing edge (slow at first, accelerating)', () => {
    // NOTE: 0.6 - 0.05 is not exactly 0.55 in IEEE 754, so these use toBeCloseTo.
    expect(slideProgress(0.55, 0.4, 0.6, 0.05)).toBeCloseTo(0, 10)
    // Halfway through the edge (q = 0.5) it has only covered q^3 = 12.5% of the travel.
    expect(slideProgress(0.575, 0.4, 0.6, 0.05)).toBeCloseTo(-0.125, 5)
  })

  it('never increases as the offset increases, and stays within [-1, 1]', () => {
    let previous = slideProgress(0, 0.4, 0.6, 0.05)
    for (let i = 1; i <= 1000; i++) {
      const value = slideProgress(i / 1000, 0.4, 0.6, 0.05)
      expect(Number.isNaN(value)).toBe(false)
      expect(value).toBeLessThanOrEqual(previous)
      expect(value).toBeGreaterThanOrEqual(-1)
      expect(value).toBeLessThanOrEqual(1)
      previous = value
    }
  })

  it('is continuous across the boundaries between edges and plateau', () => {
    const epsilon = 1e-6
    expect(Math.abs(slideProgress(0.45 - epsilon, 0.4, 0.6, 0.05) - slideProgress(0.45 + epsilon, 0.4, 0.6, 0.05))).toBeLessThan(1e-3)
    expect(Math.abs(slideProgress(0.55 - epsilon, 0.4, 0.6, 0.05) - slideProgress(0.55 + epsilon, 0.4, 0.6, 0.05))).toBeLessThan(1e-3)
  })

  it('keeps the resting position beyond the reachable scroll range (sentence 3 uses to = 2)', () => {
    // A sentence whose `to` is 2 never leaves: across the whole reachable [0, 1] range
    // it only ever enters, so it must never go negative.
    for (let i = 0; i <= 1000; i++) {
      expect(slideProgress(i / 1000, 0.78, 2, 0.06)).toBeGreaterThanOrEqual(0)
    }
  })
})
