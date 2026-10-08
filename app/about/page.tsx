import { Archivo } from 'next/font/google'
import { AboutNav } from '@/components/about/AboutNav'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Experience } from '@/components/Experience'
import { Skills } from '@/components/Skills'
import { Projects } from '@/components/Projects'
import { Education } from '@/components/Education'
import { Contact } from '@/components/Contact'
import { profile } from '@/data/content'

// Archivo with its width axis: the condensed widths set the name and the table
// heads, the regular width sets the reading text. Only /about loads it.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo' })

export default function AboutPage() {
  return (
    <div className={`datasheet ${archivo.variable}`}>
      <AboutNav />
      <main className="sm:px-6 sm:py-8">
        <div className="mx-auto max-w-[75rem] bg-ds-paper sm:border sm:border-ds-rule">
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Education />
          <Contact />
          <footer className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t-2 border-ds-ink px-5 py-5 text-[0.8125rem] text-ds-ink-2 sm:px-10">
            <span>
              {profile.name} · {profile.title}
            </span>
            <a href="#hero" className="font-semibold text-ds-ink">
              Back to top
            </a>
          </footer>
        </div>
      </main>
    </div>
  )
}
