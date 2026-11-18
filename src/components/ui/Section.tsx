import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  /** Trailing words of the title shown in red (see SectionHeading). */
  highlight?: string
  description?: string
  children: ReactNode
  className?: string
}

/** Standard section shell: centred heading, then the section content. */
export function Section({ id, eyebrow, title, highlight, description, children, className }: SectionProps) {
  return (
    <section id={id} className={cn('relative scroll-mt-20 py-24 md:py-32', className)} aria-labelledby={`${id}-title`}>
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            eyebrow={eyebrow}
            title={title}
            highlight={highlight}
            description={description}
            className="mb-12 md:mb-16"
          />
        </Reveal>
        {children}
      </div>
    </section>
  )
}
