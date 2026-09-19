export interface Point2D {
  x: number
  y: number
}

export interface Point3D {
  x: number
  y: number
  z: number
}

export interface ScatteredParticle {
  target: Point3D
  start: Point3D
}

export function sampleTextPoints(
  imageData: { data: Uint8ClampedArray; width: number; height: number },
  step: number,
  alphaThreshold: number
): Point2D[] {
  const points: Point2D[] = []
  for (let y = 0; y < imageData.height; y += step) {
    for (let x = 0; x < imageData.width; x += step) {
      const alpha = imageData.data[(y * imageData.width + x) * 4 + 3]
      if (alpha > alphaThreshold) {
        points.push({ x, y })
      }
    }
  }
  return points
}

export function createScatteredParticles(
  targets: Point2D[],
  options: {
    centerX: number
    centerY: number
    depth: number
    scatterRadius: number
    random?: () => number
  }
): ScatteredParticle[] {
  const random = options.random ?? Math.random
  return targets.map((point) => ({
    target: {
      x: point.x - options.centerX,
      y: options.centerY - point.y,
      z: (random() - 0.5) * options.depth,
    },
    start: {
      x: (random() * 2 - 1) * options.scatterRadius,
      y: (random() * 2 - 1) * options.scatterRadius,
      z: (random() * 2 - 1) * options.scatterRadius,
    },
  }))
}

export function interpolateParticle(particle: ScatteredParticle, progress: number): Point3D {
  const t = Math.min(Math.max(progress, 0), 1)
  return {
    x: particle.start.x + (particle.target.x - particle.start.x) * t,
    y: particle.start.y + (particle.target.y - particle.start.y) * t,
    z: particle.start.z + (particle.target.z - particle.start.z) * t,
  }
}
