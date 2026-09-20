import { describe, it, expect } from 'vitest'
import { fadeOpacity } from './fadeOpacity'
import { FADE_EDGE, WORDMARK_RANGE, ONE_LINER_RANGES, CTA_RANGE } from './scrollTimeline'
import { homeOneLiners } from '@/data/content'

function opacityAt(offset: number, range: [number, number]): number {
  return fadeOpacity(offset, range[0], range[1], FADE_EDGE)
}

describe('scrollTimeline', () => {
  it('keeps the wordmark and every one-liner mutually exclusive across the reachable scroll range', () => {
    const exclusiveRanges = [WORDMARK_RANGE, ...ONE_LINER_RANGES]
    for (let i = 0; i <= 1000; i++) {
      const offset = i / 1000
      const visibleCount = exclusiveRanges.filter((range) => opacityAt(offset, range) > 0).length
      expect(visibleCount, `offset ${offset} had ${visibleCount} visible`).toBeLessThanOrEqual(1)
    }
  })

  it('shows the wordmark at full opacity on the very first frame', () => {
    expect(opacityAt(0, WORDMARK_RANGE)).toBe(1)
  })

  it('shows the last one-liner and the CTA at full opacity at maximum scroll', () => {
    expect(opacityAt(1, ONE_LINER_RANGES[ONE_LINER_RANGES.length - 1])).toBe(1)
    expect(opacityAt(1, CTA_RANGE)).toBe(1)
  })

  it('has exactly one range per one-liner', () => {
    expect(ONE_LINER_RANGES).toHaveLength(homeOneLiners.length)
  })
})
