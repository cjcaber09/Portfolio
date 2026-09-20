import { describe, it, expect } from 'vitest'
import { sampleTextPoints, createScatteredParticles, interpolateParticle, boundsOfPoints } from './particlePositions'

function makeImageData(width: number, height: number, litPixels: Array<[number, number]>) {
  const data = new Uint8ClampedArray(width * height * 4)
  for (const [x, y] of litPixels) {
    const i = (y * width + x) * 4
    data[i] = 255
    data[i + 1] = 255
    data[i + 2] = 255
    data[i + 3] = 255
  }
  return { data, width, height }
}

describe('sampleTextPoints', () => {
  it('returns only points above the alpha threshold, in row-major order', () => {
    const imageData = makeImageData(4, 4, [
      [1, 1],
      [2, 2],
    ])
    const points = sampleTextPoints(imageData, 1, 128)
    expect(points).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ])
  })

  it('respects the step size', () => {
    const imageData = makeImageData(4, 4, [
      [0, 0],
      [1, 0],
      [2, 0],
    ])
    const points = sampleTextPoints(imageData, 2, 128)
    expect(points).toEqual([{ x: 0, y: 0 }, { x: 2, y: 0 }])
  })

  it('returns an empty array when nothing clears the threshold', () => {
    const imageData = makeImageData(4, 4, [])
    expect(sampleTextPoints(imageData, 1, 128)).toEqual([])
  })
})

describe('createScatteredParticles', () => {
  it('produces one particle per target, centered and depth-jittered, with a scattered start', () => {
    const targets = [{ x: 10, y: 20 }]
    let call = 0
    const random = () => {
      // Deterministic sequence: depth jitter, then 3 for the scattered start (x, y, z)
      const sequence = [0.5, 0.25, 0.75, 0.5]
      return sequence[call++ % sequence.length]
    }

    const particles = createScatteredParticles(targets, {
      centerX: 5,
      centerY: 5,
      depth: 2,
      scatterRadius: 10,
      random,
    })

    expect(particles).toHaveLength(1)
    // target: x - centerX, y flipped (centerY - y) so up is positive, z from depth jitter
    expect(particles[0].target.x).toBe(5)
    expect(particles[0].target.y).toBe(-15)
    expect(particles[0].target.z).toBeCloseTo(0, 5) // (0.5 - 0.5) * depth = 0
    // start: each axis is (random() * 2 - 1) * scatterRadius
    expect(particles[0].start.x).toBeCloseTo((0.25 * 2 - 1) * 10, 5)
    expect(particles[0].start.y).toBeCloseTo((0.75 * 2 - 1) * 10, 5)
    expect(particles[0].start.z).toBeCloseTo((0.5 * 2 - 1) * 10, 5)
  })
})

describe('interpolateParticle', () => {
  const particle = {
    start: { x: 0, y: 0, z: 0 },
    target: { x: 10, y: -20, z: 4 },
  }

  it('is at the start position when progress is 0', () => {
    expect(interpolateParticle(particle, 0)).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('is at the target position when progress is 1', () => {
    expect(interpolateParticle(particle, 1)).toEqual({ x: 10, y: -20, z: 4 })
  })

  it('is at the midpoint when progress is 0.5', () => {
    expect(interpolateParticle(particle, 0.5)).toEqual({ x: 5, y: -10, z: 2 })
  })

  it('clamps progress outside [0, 1]', () => {
    expect(interpolateParticle(particle, -1)).toEqual({ x: 0, y: 0, z: 0 })
    expect(interpolateParticle(particle, 2)).toEqual({ x: 10, y: -20, z: 4 })
  })
})

describe('boundsOfPoints', () => {
  it('returns null for an empty array', () => {
    expect(boundsOfPoints([])).toBeNull()
  })

  it('returns a zero-size box centered on a single point', () => {
    const bounds = boundsOfPoints([{ x: 10, y: 20 }])
    expect(bounds).toEqual({
      minX: 10,
      maxX: 10,
      minY: 20,
      maxY: 20,
      width: 0,
      height: 0,
      centerX: 10,
      centerY: 20,
    })
  })

  it('finds the true extremes and centre of an asymmetric set', () => {
    const bounds = boundsOfPoints([
      { x: 0, y: 100 },
      { x: 50, y: 40 },
      { x: 30, y: 0 },
    ])
    expect(bounds).toEqual({
      minX: 0,
      maxX: 50,
      minY: 0,
      maxY: 100,
      width: 50,
      height: 100,
      centerX: 25,
      centerY: 50,
    })
  })
})
