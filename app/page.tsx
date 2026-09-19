import { Nav } from '@/components/Nav'
import { HomeIntroLoader } from '@/components/home/HomeIntroLoader'

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Nav />
      <div className="relative min-h-0 flex-1">
        <HomeIntroLoader />
      </div>
    </div>
  )
}
