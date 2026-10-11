import { describe, it, expect } from 'vitest'
import {
  assignLevel,
  assignPhase,
  levelAt,
  rampAt,
  mixRgb,
  hexToRgb,
  LIGHT_RAMP,
  LIGHT_RAMP_HEX,
  DARK_RAMP,
  DARK_RAMP_HEX,
} from './contributionLevels'

describe('rampAt', () => {
  it('returns the exact ramp colour at integer levels', () => {
    expect(rampAt(0, LIGHT_RAMP)).toEqual({ r: 0xa0 / 255, g: 0xd1 / 255, b: 0xba / 255 })
    expect(rampAt(3, DARK_RAMP)).toEqual({ r: 0x55 / 255, g: 0xac / 255, b: 0x89 / 255 })
  })

  it('interpolates between neighbouring levels at fractional values', () => {
    const level1 = rampAt(1, LIGHT_RAMP)
    const level2 = rampAt(2, LIGHT_RAMP)
    const midpoint = rampAt(1.5, LIGHT_RAMP)
    expect(midpoint.r).toBeCloseTo((level1.r + level2.r) / 2, 10)
    expect(midpoint.g).toBeCloseTo((level1.g + level2.g) / 2, 10)
    expect(midpoint.b).toBeCloseTo((level1.b + level2.b) / 2, 10)
  })

  it('clamps below 0 and above the top level', () => {
    expect(rampAt(-5, DARK_RAMP)).toEqual(rampAt(0, DARK_RAMP))
    expect(rampAt(99, DARK_RAMP)).toEqual(rampAt(DARK_RAMP.length - 1, DARK_RAMP))
  })
})

describe('the contribution ramps', () => {
  const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
    const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
  }

  it('end on the site green: the top level of each ramp is that theme’s accent', () => {
    // oklch(47% 0.1 165) and oklch(68% 0.1 165), the --ds-accent values.
    expect(LIGHT_RAMP_HEX[3]).toBe('#006c4d')
    expect(DARK_RAMP_HEX[3]).toBe('#55ac89')
  })

  it('climb in activity: darker with each level on the light desk, brighter on the night desk', () => {
    const light = LIGHT_RAMP_HEX.map((hex) => luminance(hexToRgb(hex)))
    const dark = DARK_RAMP_HEX.map((hex) => luminance(hexToRgb(hex)))
    for (let level = 1; level < 4; level++) {
      expect(light[level]).toBeLessThan(light[level - 1])
      expect(dark[level]).toBeGreaterThan(dark[level - 1])
    }
  })
})

describe('mixRgb', () => {
  it('is a at t=0 and b at t=1', () => {
    const a = { r: 0, g: 0, b: 0 }
    const b = { r: 1, g: 1, b: 1 }
    expect(mixRgb(a, b, 0)).toEqual(a)
    expect(mixRgb(a, b, 1)).toEqual(b)
  })

  it('is the midpoint at t=0.5', () => {
    const a = { r: 0, g: 0.2, b: 1 }
    const b = { r: 1, g: 0.8, b: 0 }
    const mid = mixRgb(a, b, 0.5)
    expect(mid.r).toBeCloseTo(0.5, 10)
    expect(mid.g).toBeCloseTo(0.5, 10)
    expect(mid.b).toBeCloseTo(0.5, 10)
  })

  it('clamps t outside [0, 1]', () => {
    const a = { r: 0, g: 0, b: 0 }
    const b = { r: 1, g: 1, b: 1 }
    expect(mixRgb(a, b, -1)).toEqual(a)
    expect(mixRgb(a, b, 2)).toEqual(b)
  })
})

describe('assignLevel / assignPhase', () => {
  it('is deterministic for the same position', () => {
    expect(assignLevel(40, 12)).toBe(assignLevel(40, 12))
    expect(assignPhase(40, 12)).toBe(assignPhase(40, 12))
  })

  it('returns a phase in [0, 1)', () => {
    for (let x = 0; x < 40; x += 4) {
      for (let y = 0; y < 40; y += 4) {
        const phase = assignPhase(x, y)
        expect(phase).toBeGreaterThanOrEqual(0)
        expect(phase).toBeLessThan(1)
      }
    }
  })

  it('roughly matches the 20/30/30/20 weighting over a large grid-aligned sample', () => {
    const counts = [0, 0, 0, 0]
    let total = 0
    for (let x = 0; x < 660; x += 4) {
      for (let y = 0; y < 200; y += 4) {
        counts[assignLevel(x, y)]++
        total++
      }
    }
    const fractions = counts.map((c) => c / total)
    expect(fractions[0]).toBeGreaterThan(0.15)
    expect(fractions[0]).toBeLessThan(0.25)
    expect(fractions[1]).toBeGreaterThan(0.25)
    expect(fractions[1]).toBeLessThan(0.35)
    expect(fractions[2]).toBeGreaterThan(0.25)
    expect(fractions[2]).toBeLessThan(0.35)
    expect(fractions[3]).toBeGreaterThan(0.15)
    expect(fractions[3]).toBeLessThan(0.25)
  })

  it('assigns phase independently of level (mean phase per level is close to 0.5)', () => {
    const sums = [0, 0, 0, 0]
    const counts = [0, 0, 0, 0]
    for (let x = 0; x < 660; x += 4) {
      for (let y = 0; y < 200; y += 4) {
        const level = assignLevel(x, y)
        sums[level] += assignPhase(x, y)
        counts[level]++
      }
    }
    for (let level = 0; level < 4; level++) {
      const mean = sums[level] / counts[level]
      expect(mean).toBeGreaterThan(0.4)
      expect(mean).toBeLessThan(0.6)
    }
  })
})

describe('levelAt', () => {
  it('holds exactly at baseLevel while the sine is within the threshold', () => {
    // phase=0, time=0 -> sin(0) = 0, |0| <= T0
    expect(levelAt(2, 0, 0)).toBe(2)
  })

  it('never returns outside [0, 3], including at the clamping edges', () => {
    // phase=0.75, time=0 -> sin(2*pi*0.75) = -1, base 0 would go negative without clamping
    expect(levelAt(0, 0.75, 0)).toBe(0)
    // phase=0.25, time=0 -> sin(2*pi*0.25) = 1, base 3 would exceed 3 without clamping
    expect(levelAt(3, 0.25, 0)).toBe(3)
    for (let t = 0; t < 30; t += 0.5) {
      for (const base of [0, 1, 2, 3]) {
        const level = levelAt(base, 0.137, t)
        expect(level).toBeGreaterThanOrEqual(0)
        expect(level).toBeLessThanOrEqual(3)
      }
    }
  })

  it('changes continuously: a 1ms step never moves the level by more than 0.01', () => {
    for (let t = 0; t < 30; t += 0.01) {
      const a = levelAt(2, 0.137, t)
      const b = levelAt(2, 0.137, t + 0.001)
      expect(Math.abs(b - a)).toBeLessThan(0.01)
    }
  })
})
