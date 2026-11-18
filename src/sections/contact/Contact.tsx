import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { getSocialChannels } from '../../components/ui/socialChannels'
import { linkTargetProps } from '../../lib/format'
import { ContactForm } from './ContactForm'

export function Contact() {
  const channels = getSocialChannels({ withEmail: true })

  return (
    <Section
      id="contact"
     
      eyebrow="Contact"
      title="Let's build something"
      highlight="something"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <Reveal>
          <ul className="divide-y divide-ink-700 border-y border-ink-700">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...linkTargetProps(c.href)}
                  className="group flex min-h-[72px] items-center gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-ink-600 bg-ink-900 text-mist-400 transition-colors group-hover:border-crimson/50 group-hover:text-mist-100">
                    {c.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-label text-mist-600">{c.label}</span>
                    <span className="block truncate text-[15px] text-mist-200 transition-colors group-hover:text-mist-100">
                      {c.display}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  )
}
