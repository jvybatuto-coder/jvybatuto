import { Briefcase } from 'lucide-react'
import { BulletList } from '../components/ui/BulletList'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { experience } from '../data/experience'

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Work & involvement">
      <div className="divide-y divide-ink-700 border-y border-ink-700">
        {experience.map((x, i) => (
          <Reveal key={i} delay={0.06 * i}>
            <article className="group grid gap-4 py-8 transition-colors md:grid-cols-[220px_1fr_auto] md:gap-10">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-mist-400">{x.period}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-mist-600">{x.type}</p>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-mist-100 transition-colors group-hover:text-mist-100">
                  {x.role}
                </h3>
                <p className="mt-1 text-mist-400">{x.organization}</p>
                <BulletList items={x.points} className="mt-4" itemClassName="text-sm leading-relaxed text-mist-400" />
                {x.tags && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {x.tags.map((t, ti) => (
                      <li key={t + ti} className="rounded border border-ink-600 px-2 py-0.5 font-mono text-[11px] text-mist-500">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Briefcase
                size={18}
                strokeWidth={1.5}
                className="hidden text-ink-500 transition-colors group-hover:text-crimson md:block"
                aria-hidden
              />
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
