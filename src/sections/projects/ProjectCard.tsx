import { ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Project } from '../../data/projects'
import { useInView } from '../../hooks/useInView'
import { cn } from '../../lib/cn'
import { ProjectCover } from './ProjectCover'
import { ProjectLinks } from './ProjectLinks'

interface ProjectCardProps {
  project: Project
  /** Featured cards span the full grid width with the cover beside the text. */
  featured: boolean
  onOpen: () => void
}

/** Stagger slot for the info panel's content reveal (see .project-reveal in index.css). */
const step = (i: number) => ({ '--step': i }) as CSSProperties

export function ProjectCard({ project, featured, onOpen }: ProjectCardProps) {
  // The cover slides in from the left and the info panel from the right each time 18% scrolls into view.
  const [ref, inView] = useInView<HTMLElement>(0.18)
  const tagStart = 3

  return (
    <article
      ref={ref}
      className={cn(
        'card-surface project-reveal group flex h-full flex-col',
        inView && 'is-visible',
        featured && 'lg:grid lg:grid-cols-[1.25fr_1fr]',
      )}
    >
      <button
        onClick={onOpen}
        className={cn(
          'project-reveal-media relative block overflow-hidden rounded-t-lg border-b border-ink-700 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-crimson',
          featured
            ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[340px] lg:rounded-r-none lg:rounded-bl-lg lg:border-b-0 lg:border-r'
            : 'aspect-[16/10]',
        )}
        aria-label={`View details of ${project.name}`}
      >
        <ProjectCover project={project} large={featured} />
      </button>

      <div className="project-reveal-info flex flex-1 flex-col rounded-b-lg p-6 sm:p-7 lg:rounded-l-none lg:rounded-r-lg">
        <div className="pr-step flex items-center justify-between font-mono text-[10px] uppercase tracking-label" style={step(0)}>
          <span className="text-crimson">Project {project.index}</span>
          <span className="text-mist-600">{project.category}</span>
        </div>
        <h3 className="pr-step mt-4 font-display text-2xl font-semibold tracking-tight text-mist-100" style={step(1)}>
          {project.name}
        </h3>
        <p className="pr-step mt-3 text-[15px] leading-relaxed text-mist-400" style={step(2)}>
          {project.summary}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tech.map((t, i) => (
            <li
              key={t}
              style={step(tagStart + i * 0.8)}
              className="pr-step pr-tag rounded border border-ink-600 bg-ink-900 px-2 py-1 font-mono text-[11px] text-mist-400 hover:border-crimson/50 hover:text-mist-200"
            >
              {t}
            </li>
          ))}
        </ul>

        <div
          className="pr-step mt-auto flex flex-wrap items-center justify-between gap-3 pt-7"
          style={step(tagStart + project.tech.length * 0.8 + 0.5)}
        >
          <ProjectLinks project={project} compact />
          <button
            onClick={onOpen}
            className="inline-flex min-h-[40px] items-center gap-1.5 text-[13px] font-medium text-mist-200 transition-colors hover:text-crimson-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
          >
            View Details
            <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  )
}
