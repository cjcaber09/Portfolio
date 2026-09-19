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

export interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
  width: number
  height: number
  centerX: number
  centerY: number
}

export function boundsOfPoints(points: Point2D[]): Bounds | null {
  if (points.length === 0) return null

  let minX = points[0].x
  let maxX = points[0].x
  let minY = points[0].y
  let maxY = points[0].y

  for (const point of points) {
    if (point.x < minX) minX = point.x
    if (point.x > maxX) maxX = point.x
    if (point.y < minY) minY = point.y
    if (point.y > maxY) maxY = point.y
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  }
}
