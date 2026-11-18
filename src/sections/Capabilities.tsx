import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { capabilities } from '../data/capabilities'
import { pad2 } from '../lib/format'

export function Capabilities() {
  return (
    <Section
      id="services"
      eyebrow="What I Can Do"
      title="Practical capabilities"
      description="The kinds of work I can take on, from interface to database."
      className="border-y border-ink-800 bg-ink-900/40"
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-ink-700 bg-ink-700 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c, i) => (
          <Reveal key={c.title} delay={0.05 * i} className="group relative bg-ink-950 p-7 transition-colors duration-300 hover:bg-ink-850">
            <span className="absolute left-0 top-0 h-px w-0 bg-crimson transition-all duration-500 group-hover:w-full" aria-hidden />
            <div className="flex items-center justify-between">
              <c.icon size={22} strokeWidth={1.5} className="text-mist-400 transition-colors group-hover:text-crimson-light" />
              <span className="font-mono text-[11px] text-mist-600">{pad2(i + 1)}</span>
            </div>
            <h3 className="mt-6 font-display text-[17px] font-semibold text-mist-100">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-500">{c.description}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
