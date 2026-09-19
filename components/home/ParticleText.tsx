'use client'

import { useMemo, useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { rasterizeText } from './rasterizeText'
import {
  sampleTextPoints,
  createScatteredParticles,
  interpolateParticle,
  boundsOfPoints,
  type Point2D,
  type ScatteredParticle,
} from './particlePositions'
import { assignLevel, assignPhase, levelAt, rampAt, mixRgb } from './contributionLevels'
import { fitScale } from './fitScale'
import { WORDMARK_RANGE, NAME_ASSEMBLY_END, FADE_EDGE } from './scrollTimeline'
import { fadeOpacity } from './fadeOpacity'
import { homeWordmarkName } from '@/data/content'

const RASTER_WIDTH = 660
const RASTER_HEIGHT = 200
const CEEDEV_TEXT = 'CeeDev'
const CEEDEV_FONT_SIZE = 84
const CEEDEV_Y = 72
const NAME_FONT_SIZE = 42
const NAME_Y = 145
const SAMPLE_STEP = 4
const ALPHA_THRESHOLD = 128
const DOT_RADIUS = SAMPLE_STEP * 0.34
const DOT_SEGMENTS = 10
const DEPTH_JITTER = 1.2
const SCATTER_RADIUS = 400
const FIT_MARGIN = 0.2
const FIT_MAX_WIDTH_PX = 960
const FONT_FAMILY = 'system-ui, sans-serif'

interface Lattice {
  particles: ScatteredParticle[]
  levels: number[]
  phases: number[]
}

function buildLattice(points: Point2D[], centerX: number, centerY: number): Lattice {
  const particles = createScatteredParticles(points, {
    centerX,
    centerY,
    depth: DEPTH_JITTER,
    scatterRadius: SCATTER_RADIUS,
  })
  return {
    particles,
    levels: points.map((point) => assignLevel(point.x, point.y)),
    phases: points.map((point) => assignPhase(point.x, point.y)),
  }
}

export function ParticleText() {
  const scroll = useScroll()
  const viewport = useThree((state) => state.viewport)
  const canvasWidthPx = useThree((state) => state.size.width)

  const ceeDevMeshRef = useRef<THREE.InstancedMesh>(null)
  const nameMeshRef = useRef<THREE.InstancedMesh>(null)

  // Rasterizing and sampling both lines is expensive and the text never
  // changes, so this only runs once. Both lines are rasterized at
  // identical canvas dimensions and sampled at the identical step so they
  // land on one continuous lattice, and their combined bounds (not the
  // canvas's own centre) become the single shared world-space origin both
  // lines are built around — see the design spec's "Both lines share one
  // world-space origin" section for why this must not be done per-line.
  const { ceeDev, name, bounds } = useMemo(() => {
    const ceeDevImage = rasterizeText(CEEDEV_TEXT, {
      width: RASTER_WIDTH,
      height: RASTER_HEIGHT,
      fontSize: CEEDEV_FONT_SIZE,
      fontFamily: FONT_FAMILY,
      y: CEEDEV_Y,
    })
    const nameImage = rasterizeText(homeWordmarkName, {
      width: RASTER_WIDTH,
      height: RASTER_HEIGHT,
      fontSize: NAME_FONT_SIZE,
      fontFamily: FONT_FAMILY,
      y: NAME_Y,
    })

    const ceeDevPoints = sampleTextPoints(ceeDevImage, SAMPLE_STEP, ALPHA_THRESHOLD)
    const namePoints = sampleTextPoints(nameImage, SAMPLE_STEP, ALPHA_THRESHOLD)
    const combinedBounds = boundsOfPoints([...ceeDevPoints, ...namePoints])
    const centerX = combinedBounds?.centerX ?? RASTER_WIDTH / 2
    const centerY = combinedBounds?.centerY ?? RASTER_HEIGHT / 2

    return {
      ceeDev: buildLattice(ceeDevPoints, centerX, centerY),
      name: buildLattice(namePoints, centerX, centerY),
      bounds: combinedBounds,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rasterizes fixed, constant text; intentionally runs once
  }, [])

  const scale = useMemo(
    () =>
      fitScale(bounds, viewport, {
        margin: FIT_MARGIN,
        maxWidthPx: FIT_MAX_WIDTH_PX,
        canvasWidthPx,
      }),
    [bounds, viewport.width, viewport.height, canvasWidthPx]
  )

  // "CeeDev" never moves: its instance matrices are written once, here,
  // and never touched again. Its per-frame cost is colour only (shimmer).
  useLayoutEffect(() => {
    const mesh = ceeDevMeshRef.current
    if (!mesh) return
    const matrix = new THREE.Matrix4()
    for (let i = 0; i < ceeDev.particles.length; i++) {
      const point = interpolateParticle(ceeDev.particles[i], 1)
      matrix.setPosition(point.x, point.y, point.z)
      mesh.setMatrixAt(i, matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [ceeDev])

  const tempColor = useMemo(() => new THREE.Color(), [])
  const tempMatrix = useMemo(() => new THREE.Matrix4(), [])

  useFrame((state) => {
    const ceeDevMesh = ceeDevMeshRef.current
    const nameMesh = nameMeshRef.current
    if (!ceeDevMesh || !nameMesh) return

    const wordmarkOpacity = fadeOpacity(scroll.offset, WORDMARK_RANGE[0], WORDMARK_RANGE[1], FADE_EDGE)

    if (wordmarkOpacity <= 0) {
      // Nothing is visible for the remaining ~68% of the scroll track once
      // the wordmark has faded out — skip every per-frame computation, not
      // just the paint.
      ceeDevMesh.visible = false
      nameMesh.visible = false
      return
    }

    ceeDevMesh.visible = true
    nameMesh.visible = true
    ;(ceeDevMesh.material as THREE.MeshBasicMaterial).opacity = wordmarkOpacity
    ;(nameMesh.material as THREE.MeshBasicMaterial).opacity = wordmarkOpacity

    const time = state.clock.elapsedTime
    const progress = THREE.MathUtils.clamp(scroll.offset / NAME_ASSEMBLY_END, 0, 1)
    const floor = rampAt(0)

    for (let i = 0; i < ceeDev.particles.length; i++) {
      const target = rampAt(levelAt(ceeDev.levels[i], ceeDev.phases[i], time))
      tempColor.setRGB(target.r, target.g, target.b, THREE.SRGBColorSpace)
      ceeDevMesh.setColorAt(i, tempColor)
    }
    if (ceeDevMesh.instanceColor) ceeDevMesh.instanceColor.needsUpdate = true

    for (let i = 0; i < name.particles.length; i++) {
      const point = interpolateParticle(name.particles[i], progress)
      tempMatrix.setPosition(point.x, point.y, point.z)
      nameMesh.setMatrixAt(i, tempMatrix)

      // Shimmer picks the target colour first; that target is then mixed
      // from the floor by `progress`. Mixing toward the base colour first
      // and applying shimmer after would let shimmer move dots mid-flight.
      const target = rampAt(levelAt(name.levels[i], name.phases[i], time))
      const mixed = mixRgb(floor, target, progress)
      tempColor.setRGB(mixed.r, mixed.g, mixed.b, THREE.SRGBColorSpace)
      nameMesh.setColorAt(i, tempColor)
    }
    nameMesh.instanceMatrix.needsUpdate = true
    if (nameMesh.instanceColor) nameMesh.instanceColor.needsUpdate = true
  })

  return (
    <group scale={scale}>
      {/* frustumCulled=false: an InstancedMesh's default bounding sphere is
          computed from its geometry alone (a single ~1.4-unit-radius
          circle at the local origin), not from where each instance's
          matrix actually places it. Without this, three.js could cull the
          entire wordmark as "off-screen" based on that tiny, wrong bounding
          sphere. The instance count here (low thousands) makes disabling
          frustum culling entirely cheaper than keeping a correct bounding
          sphere in sync every frame. */}
      <instancedMesh ref={ceeDevMeshRef} args={[undefined, undefined, ceeDev.particles.length]} frustumCulled={false}>
        <circleGeometry args={[DOT_RADIUS, DOT_SEGMENTS]} />
        <meshBasicMaterial toneMapped={false} transparent />
      </instancedMesh>
      <instancedMesh ref={nameMeshRef} args={[undefined, undefined, name.particles.length]} frustumCulled={false}>
        <circleGeometry args={[DOT_RADIUS, DOT_SEGMENTS]} />
        <meshBasicMaterial toneMapped={false} transparent />
      </instancedMesh>
    </group>
  )
}
