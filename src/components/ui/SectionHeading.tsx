import { cn } from '../../lib/cn'

interface SectionHeadingProps {
  /** Id for the <h2>, referenced by the section's aria-labelledby. */
  id: string
  /** Small red label shown between two thin lines, e.g. "My Skills". */
  eyebrow: string
  title: string
  /** Trailing words of `title` to show in red with a hand-drawn underline (must end the title). */
  highlight?: string
  description?: string
  className?: string
}

/** Centred section intro: lined eyebrow, large title with a highlighted ending, optional description. */
export function SectionHeading({ id, eyebrow, title, highlight, description, className }: SectionHeadingProps) {
  const splitAt = highlight && title.endsWith(highlight) ? title.length - highlight.length : title.length
  const lead = title.slice(0, splitAt).trimEnd()
  const accent = title.slice(splitAt)

  return (
    <header className={cn('mx-auto max-w-5xl text-center', className)}>
      <p className="flex items-center justify-center gap-4 font-display text-sm font-semibold uppercase tracking-[0.3em] text-crimson sm:gap-6 sm:text-[17px]">
        <span className="h-px w-12 bg-crimson/60 sm:w-40 md:w-48" aria-hidden />
        {eyebrow}
        <span className="h-px w-12 bg-crimson/60 sm:w-40 md:w-48" aria-hidden />
      </p>
      <h2 id={id} className="mt-6 font-display text-[clamp(2rem,5.2vw,3.6rem)] font-bold leading-[1.1] tracking-tight text-mist-100">
        {lead}
        {lead && accent && ' '}
        {accent && (
          <span className="relative inline-block whitespace-nowrap text-crimson">
            {accent}
            <svg className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
              <path d="M2 9 C 50 3, 120 2, 198 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        )}
      </h2>
      {description && (
        <p className="mx-auto mt-7 max-w-[62rem] text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-mist-400">{description}</p>
      )}
    </header>
  )
}
