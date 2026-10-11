import { archivo } from '@/app/fonts'
import { SiteNav } from '@/components/SiteNav'
import { HomeIntroLoader } from '@/components/home/HomeIntroLoader'

// The cover of the datasheet (DESIGN.md): the same .datasheet world as /about,
// so the header, face, tokens, and desk are shared, with the contribution-grid
// intro filling the space under the header.
export default function Home() {
  return (
    <div className={`datasheet ${archivo.variable} flex min-h-dvh flex-col`}>
      <SiteNav onCover />
      <div className="relative min-h-0 flex-1">
        <HomeIntroLoader />
      </div>
    </div>
  )
}
