import type { CSSProperties } from 'react'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { technologies } from '../data/skills'
import { cn } from '../lib/cn'

/**
 * Skills: centred intro plus six large official technology logos sitting directly on the page
 * (no cards). Sizing and hover live in index.css under "Skills section".
 */
export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-20 py-24 md:py-32" aria-labelledby="skills-title">
      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            id="skills-title"
            eyebrow="My Skills"
            title="Technologies I Work With"
            highlight="Work With"
          />
        </Reveal>

        <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:mt-20 md:grid-cols-3 md:gap-y-16 xl:grid-cols-6 xl:gap-x-4">
          {technologies.map((t, i) => (
            <Reveal key={t.id} as="li" delay={0.06 * i} className="tech-item flex flex-col items-center text-center">
              <span className="tech-logo-box flex items-center justify-center" aria-hidden>
                <span
                  className={cn('tech-logo block', `tech-logo--${t.id}`)}
                  style={{ '--logo-w': t.width } as CSSProperties}
                  // trusted local SVG files from /src/assets/tech
                  dangerouslySetInnerHTML={{ __html: t.logo }}
                />
              </span>
              <span className="tech-name mt-5 font-display text-[clamp(1.15rem,1.7vw,1.75rem)] font-bold leading-none tracking-tight text-mist-100">
                {t.name}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
