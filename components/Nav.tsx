import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '/about#about', label: 'About' },
  { href: '/about#experience', label: 'Experience' },
  { href: '/about#skills', label: 'Skills' },
  { href: '/about#projects', label: 'Projects' },
  { href: '/about#education', label: 'Education' },
  { href: '/about#contact', label: 'Contact' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="/" className="font-semibold">
          CeeDev
        </a>
        <ul className="hidden gap-6 text-sm sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-emerald-700 dark:hover:text-emerald-400">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  )
}
