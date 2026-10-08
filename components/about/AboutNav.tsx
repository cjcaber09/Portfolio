'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { sectionLinks } from '@/components/navLinks'

// The /about table of contents. Home leads and points at the hero (the
// datasheet's front page); the rest are the shared section links.
const links = [{ href: '/about#hero', label: 'Home' }, ...sectionLinks]
const sectionIds = links.map((link) => link.href.split('#')[1])

// Which section is "current": the one crossing a thin reading band a third of
// the way down the viewport, where the eye is when a section is being read.
const READING_BAND = '-33% 0px -62% 0px'

export function AboutNav() {
  const [current, setCurrent] = useState(sectionIds[0])
  const navRef = useRef<HTMLElement>(null)

  // On a phone the link row scrolls sideways; keep the current link in view
  // so the marker never sits off-screen. Only the row scrolls, never the page.
  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector<HTMLElement>('[aria-current]')
    if (!nav || !link) return
    const linkBox = link.getBoundingClientRect()
    const navBox = nav.getBoundingClientRect()
    if (linkBox.left >= navBox.left && linkBox.right <= navBox.right) return
    const centred = linkBox.left - navBox.left - (navBox.width - linkBox.width) / 2
    nav.scrollTo({ left: nav.scrollLeft + centred })
  }, [current])

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const crossing = entries.find((entry) => entry.isIntersecting)
        if (crossing) setCurrent(crossing.target.id)
      },
      { rootMargin: READING_BAND }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-ds-rule bg-ds-paper">
      <div className="mx-auto flex max-w-[75rem] flex-wrap items-center gap-x-8 px-5 sm:px-10">
        <Link
          href="/"
          className="flex h-14 items-center gap-2 text-[1.125rem] font-extrabold tracking-[-0.01em] text-ds-ink no-underline [font-stretch:80%]"
        >
          <span aria-hidden="true" className="size-3 bg-ds-accent" />
          CeeDev
        </Link>
        {/* Brand, links, and switch share one row only from lg, where they fit
            with room to spare; below it the links get their own row, which
            scrolls sideways on a phone. */}
        <div className="ml-auto flex h-14 items-center lg:order-last">
          <ThemeToggle variant="datasheet" />
        </div>
        <nav
          ref={navRef}
          aria-label="Sections"
          className="-mx-5 w-[calc(100%+2.5rem)] overflow-x-auto [scrollbar-width:thin] sm:-mx-10 sm:w-[calc(100%+5rem)] lg:mx-0 lg:w-auto"
        >
          <ul className="flex h-11 w-max min-w-full items-stretch gap-6 border-t border-ds-rule px-5 text-[0.8125rem] font-semibold whitespace-nowrap sm:px-10 lg:h-14 lg:border-t-0 lg:px-0">
            {links.map((link, index) => {
              const isCurrent = sectionIds[index] === current
              return (
                <li key={link.href} className="flex">
                  <a
                    href={link.href}
                    aria-current={isCurrent ? 'location' : undefined}
                    className={`flex items-center border-b-2 no-underline transition-colors duration-[120ms] ${
                      isCurrent
                        ? 'border-ds-accent text-ds-ink'
                        : 'border-transparent text-ds-ink-2 hover:text-ds-ink'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
