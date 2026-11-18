import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Hand } from 'lucide-react'
import { LanyardStage } from '../components/lanyard/LanyardStage'
import { profile } from '../data/profile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { cn } from '../lib/cn'
import { EASE_OUT } from '../lib/motion'
import { scrollToId } from '../lib/scroll'

export function Hero() {
  const reduce = !!useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  // "Progress Over Perfection, Learning Through Experience." → white lead, red ending
  const comma = profile.intro.indexOf(',') + 1
  const taglineLead = comma ? profile.intro.slice(0, comma) : profile.intro
  const taglineEnd = comma ? profile.intro.slice(comma).trim() : ''

  // whole name in the outlined style, no trailing dot
  const name = <span className="text-outline">{profile.fullName}</span>

  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
  }

  return (
    <section id="home" className="relative isolate overflow-hidden lg:min-h-[100svh]" aria-label="Introduction">

      <div className="mx-auto grid max-w-site grid-cols-1 px-5 sm:px-8 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:items-center">
        {/* lanyard — first on mobile so the card hangs from the top */}
        <div className="relative order-1 -mx-5 h-[560px] sm:-mx-8 sm:h-[620px] lg:absolute lg:inset-y-0 lg:left-[46%] lg:right-0 lg:order-2 lg:mx-0 lg:h-auto">
          <LanyardStage reducedMotion={reduce} compact={!isDesktop} />
          <p className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-label text-mist-600 lg:bottom-[3%]">
            <Hand size={12} className="text-crimson" /> Drag the card
          </p>
        </div>

        {/* intro */}
        <motion.div
          className="relative z-10 order-2 pb-20 lg:order-1 lg:py-32"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.15 } } }}
        >
          {/* tagline: stationary, above the name */}
          <motion.p
            variants={item}
            className="max-w-[36rem] font-display text-[clamp(2.25rem,4.8vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-mist-100"
          >
            {taglineLead}
            {taglineEnd && (
              <>
                {' '}
                <span className="text-crimson">{taglineEnd}</span>
              </>
            )}
          </motion.p>

          {/* name: one copy slides right → left inside a strip as wide as the tagline,
              so it never reaches the swinging ID card (static when motion is reduced) */}
          <motion.div variants={item} className="mt-8 max-w-[36rem] sm:mt-10">
            <h1 className="sr-only">{profile.fullName}</h1>
            <div className="hero-marquee" aria-hidden>
              <span className={cn('hero-marquee-name', reduce && 'hero-marquee-name--still')}>{name}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <button
        onClick={() => scrollToId('about')}
        className="absolute bottom-8 left-8 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-label text-mist-600 transition-colors hover:text-mist-300 lg:flex"
        aria-label="Scroll to About section"
      >
        <span className="flex h-9 w-6 items-start justify-center rounded-full border border-ink-500 pt-1.5">
          <ArrowDown size={11} className={reduce ? '' : 'animate-bounce'} />
        </span>
        Scroll
      </button>
    </section>
  )
}
