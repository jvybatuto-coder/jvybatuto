import { GraduationCap, MapPin } from 'lucide-react'
import { BulletList } from '../components/ui/BulletList'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { education } from '../data/education'
import { cn } from '../lib/cn'

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Academic background">
      <ol className="relative ml-2 border-l border-ink-600 md:ml-0">
        {education.map((e, i) => (
          <Reveal as="li" key={`${e.institution}-${e.period}`} delay={0.08 * i} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
            <span
              aria-hidden
              className={cn(
                'absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2',
                e.current ? 'border-crimson bg-ink-950 shadow-[0_0_0_4px_rgba(200,16,46,0.15)]' : 'border-ink-500 bg-ink-950',
              )}
            />
            <div className="grid gap-6 md:grid-cols-[200px_1fr] md:gap-10">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-mist-300">{e.period}</p>
                {e.current && (
                  <span className="mt-2 inline-block rounded border border-crimson/40 bg-crimson/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-crimson-light">
                    Current
                  </span>
                )}
              </div>

              <div className="card-surface p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-ink-600 bg-ink-900 text-mist-300">
                    <GraduationCap size={18} strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-mist-100">{e.degree}</h3>
                    <p className="mt-1 text-mist-400">{e.institution}</p>
                    {e.location && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-mist-600">
                        <MapPin size={12} /> {e.location}
                      </p>
                    )}
                  </div>
                </div>

                {e.coursework && (
                  <div className="mt-6">
                    <h4 className="font-mono text-[10px] uppercase tracking-label text-mist-600">Relevant coursework</h4>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {e.coursework.map((c) => (
                        <li key={c} className="rounded border border-ink-600 bg-ink-900 px-2.5 py-1 text-xs text-mist-300">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {e.milestones && (
                  <div className="mt-6">
                    <h4 className="font-mono text-[10px] uppercase tracking-label text-mist-600">Milestones</h4>
                    <BulletList items={e.milestones} className="mt-3" />
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
