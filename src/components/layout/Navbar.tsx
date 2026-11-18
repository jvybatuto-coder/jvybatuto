import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import logo from '../../assets/brand/logo.webp'
import { navLinks } from '../../data/navigation'
import { profile } from '../../data/profile'
import { useActiveSection } from '../../hooks/useActiveSection'
import { cn } from '../../lib/cn'
import { pad2 } from '../../lib/format'
import { scrollToId } from '../../lib/scroll'
import { ResumeButton } from '../resume/ResumeButton'
import { ThemeToggle } from './ThemeToggle'

const ids = navLinks.map((l) => l.id)

export function Navbar() {
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open ? 'border-b border-ink-700/80 bg-ink-950/85 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      {/* three columns: logo + theme toggle | centred links | resume (+ mobile actions), so the links stay centred */}
      <nav
        className="mx-auto grid h-16 max-w-site grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8"
        aria-label="Primary"
      >
        <div className="flex items-center justify-between gap-4 lg:pr-6">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              go('home')
            }}
            aria-label={`${profile.shortName}.dev, back to top`}
            className="group flex items-center gap-3 justify-self-start rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
          >
            <img
              src={logo}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-mist-400 transition-colors group-hover:text-mist-100 sm:block">
              {profile.shortName}.dev
            </span>
          </a>
          {/* desktop: sits between the brand and the links */}
          <ThemeToggle className="hidden lg:flex" />
        </div>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  go(l.id)
                }}
                aria-current={active === l.id ? 'true' : undefined}
                className={cn(
                  'relative rounded-md px-3.5 py-2 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson',
                  active === l.id ? 'text-mist-100' : 'text-mist-400 hover:text-mist-100',
                )}
              >
                {l.label}
                {active === l.id && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute inset-x-3.5 -bottom-[1px] h-[2px] rounded-full bg-crimson"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <ResumeButton className="h-11 px-3 sm:px-4 lg:h-10" />
          <ThemeToggle className="h-11 w-11 lg:hidden" />
          <button
            className="flex h-11 w-11 items-center justify-center rounded-md border border-ink-600 text-mist-200 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ink-700 bg-ink-950 lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="mx-auto flex max-w-site flex-col px-5 py-6 sm:px-8">
              {navLinks.map((l, i) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      go(l.id)
                    }}
                    className={cn(
                      'flex min-h-[56px] items-center justify-between border-b border-ink-800 font-display text-xl',
                      active === l.id ? 'text-mist-100' : 'text-mist-400',
                    )}
                  >
                    {l.label}
                    <span className={cn('font-mono text-xs', active === l.id ? 'text-crimson' : 'text-mist-600')}>
                      {pad2(i + 1)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
