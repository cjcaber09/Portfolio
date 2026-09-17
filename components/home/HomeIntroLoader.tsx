'use client'

import dynamic from 'next/dynamic'

const HomeIntro = dynamic(() => import('./HomeIntro').then((mod) => mod.HomeIntro), {
  ssr: false,
})

export function HomeIntroLoader() {
  return <HomeIntro />
}
