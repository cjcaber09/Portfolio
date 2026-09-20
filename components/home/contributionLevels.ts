export interface Rgb {
  r: number
  g: number
  b: number
}

export const RAMP_HEX = ['#15503a', '#05734f', '#0f9e6b', '#2cc98c'] as const

function hexToRgb(hex: string): Rgb {
  const value = parseInt(hex.slice(1), 16)
  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  }
}

const RAMP: Rgb[] = RAMP_HEX.map(hexToRgb)

const LEVEL_WEIGHTS = [0.2, 0.3, 0.3, 0.2]
const T0 = 0.988
const PERIOD_SECONDS = 30

// FNV-1a mixed with a full murmur3 finalizer. A single xorshift-multiply
// round (as used in the throwaway visual-companion mockups this design was
// reviewed with) does not fully avalanche grid-aligned inputs: sampled at
// multiples of SAMPLE_STEP, it collapsed the level distribution to two
// buckets and made assignPhase perfectly correlated with assignLevel. This
// finalizer was verified (see the design's review history) to produce a
// ~20/30/30/20 split and a mean phase near 0.5 per level on real,
// grid-aligned (x, y) input.
function hash2D(x: number, y: number, salt: number): number {
  let h = 2166136261 ^ salt
  h = Math.imul(h ^ x, 16777619)
  h = Math.imul(h ^ y, 16777619)
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

export function assignLevel(x: number, y: number): number {
  const r = hash2D(x, y, 0)
  let cumulative = 0
  for (let level = 0; level < LEVEL_WEIGHTS.length; level++) {
    cumulative += LEVEL_WEIGHTS[level]
    if (r < cumulative) return level
  }
  return LEVEL_WEIGHTS.length - 1
}

export function assignPhase(x: number, y: number): number {
  // salt=1: an independent hash output from assignLevel's salt=0, so a
  // dot's brightness and its shimmer timing never correlate. See
  // components/home/contributionLevels.test.ts's mean-phase-per-level test.
  return hash2D(x, y, 1)
}

export function levelAt(baseLevel: number, phase: number, timeSeconds: number): number {
  const s = Math.sin(2 * Math.PI * (timeSeconds / PERIOD_SECONDS + phase))
  const magnitude = Math.abs(s)
  const f = Math.min(Math.max((magnitude - T0) / (1 - T0), 0), 1)
  const direction = Math.sign(s)
  return Math.min(Math.max(baseLevel + direction * f, 0), 3)
}

export function rampAt(level: number): Rgb {
  const clamped = Math.min(Math.max(level, 0), RAMP.length - 1)
  const lower = Math.floor(clamped)
  const upper = Math.min(lower + 1, RAMP.length - 1)
  const t = clamped - lower
  return {
    r: RAMP[lower].r + (RAMP[upper].r - RAMP[lower].r) * t,
    g: RAMP[lower].g + (RAMP[upper].g - RAMP[lower].g) * t,
    b: RAMP[lower].b + (RAMP[upper].b - RAMP[lower].b) * t,
  }
}

export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const clampedT = Math.min(Math.max(t, 0), 1)
  return {
    r: a.r + (b.r - a.r) * clampedT,
    g: a.g + (b.g - a.g) * clampedT,
    b: a.b + (b.b - a.b) * clampedT,
  }
}
