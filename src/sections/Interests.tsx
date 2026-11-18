import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { interests } from '../data/interests'

export function Interests() {
  return (
    <Section
      id="interests"
      eyebrow="Areas of Interest"
      title="Where my curiosity goes"
      className="border-t border-ink-800"
    >
      <ul className="flex flex-wrap gap-3">
        {interests.map((it, i) => (
          <Reveal as="li" key={it.title} delay={0.04 * i}>
            <span className="group flex min-h-[52px] items-center gap-3 rounded-md border border-ink-600 bg-ink-900/70 px-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-crimson/50 hover:bg-ink-850">
              <it.icon size={18} strokeWidth={1.6} className="text-mist-500 transition-colors group-hover:text-crimson-light" />
              <span className="text-[15px] text-mist-200">{it.title}</span>
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
