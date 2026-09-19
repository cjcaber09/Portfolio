import { describe, it, expect } from 'vitest'
import { fadeOpacity } from './fadeOpacity'

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
