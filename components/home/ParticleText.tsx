'use client'

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { rasterizeText } from './rasterizeText'
import { sampleTextPoints, createScatteredParticles, interpolateParticle } from './particlePositions'

const TEXT = 'CeeDev'
const RASTER_WIDTH = 480
const RASTER_HEIGHT = 160
const SAMPLE_STEP = 3
const ALPHA_THRESHOLD = 128
const SCATTER_RADIUS = 400
const DEPTH_JITTER = 1.2
const WORLD_SCALE = 0.02
const GATHER_END_OFFSET = 0.4

export function ParticleText() {
  const scroll = useScroll()

  const particles = useMemo(() => {
    const imageData = rasterizeText(TEXT, {
      width: RASTER_WIDTH,
      height: RASTER_HEIGHT,
      fontSize: 96,
      fontFamily: 'system-ui, sans-serif',
    })
    const points = sampleTextPoints(imageData, SAMPLE_STEP, ALPHA_THRESHOLD)
    return createScatteredParticles(points, {
      centerX: RASTER_WIDTH / 2,
      centerY: RASTER_HEIGHT / 2,
      depth: DEPTH_JITTER,
      scatterRadius: SCATTER_RADIUS,
    })
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(particles.length * 3), 3)
    )
    return geo
  }, [particles])

  useFrame(() => {
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const progress = THREE.MathUtils.clamp(scroll.offset / GATHER_END_OFFSET, 0, 1)
    for (let i = 0; i < particles.length; i++) {
      const p = interpolateParticle(particles[i], progress)
      positionAttr.setXYZ(i, p.x * WORLD_SCALE, p.y * WORLD_SCALE, p.z * WORLD_SCALE)
    }
    positionAttr.needsUpdate = true
  })

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#34d399" size={0.04} sizeAttenuation transparent opacity={0.9} />
    </points>
  )
}
