import { UserRound } from 'lucide-react'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { about } from '../data/about'
import { profile } from '../data/profile'
import { splitName } from '../lib/format'

export function About() {
  const { first, last } = splitName(profile.fullName)
  return (
    <Section id="about" eyebrow="About" title={about.heading} highlight="introduction">
      <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        {/* portrait */}
        <Reveal>
          <figure className="relative mx-auto max-w-sm md:mx-0">
            <div className="corner-frame relative aspect-[4/5] overflow-hidden rounded-lg border border-ink-600 bg-ink-850">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={`Portrait of ${profile.fullName}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover grayscale-[20%] transition duration-700 hover:grayscale-0"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,#141416,#0d0d0f)]">
                  <UserRound size={64} strokeWidth={1} className="text-ink-500" />
                  <span className="font-mono text-[10px] uppercase tracking-label text-mist-600">Profile photo</span>
                </div>
              )}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </figure>
        </Reveal>

        {/* bio */}
        <div className="flex flex-col justify-center">
          {/* greeting + name, shown first */}
          <Reveal>
            <p className="font-display text-lg font-semibold text-crimson md:text-xl">Hello, I&apos;m</p>
            <p className="mt-2 font-display text-[clamp(2.4rem,5vw,4rem)] font-bold uppercase leading-[1.02] tracking-tight text-mist-100">
              {first}
              <br />
              {last}
            </p>
          </Reveal>

          {about.bio.map((p, i) => (
            <Reveal key={i} delay={0.08 * (i + 1)}>
              <p className={i === 0 ? 'mt-8 text-lg font-semibold leading-relaxed text-mist-100 md:text-xl' : 'mt-5 font-semibold leading-relaxed text-mist-300'}>
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
