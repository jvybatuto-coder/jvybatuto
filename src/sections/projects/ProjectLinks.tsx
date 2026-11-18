import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'
import { GithubIcon } from '../../components/ui/BrandIcons'
import type { Project } from '../../data/projects'
import { cn } from '../../lib/cn'

const base =
  'inline-flex min-h-[40px] items-center gap-2 rounded-md border px-3.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson'
const enabled = 'border-ink-600 text-mist-200 hover:border-crimson/60 hover:text-mist-100'
const disabled = 'cursor-not-allowed border-ink-700 text-mist-600'

/** A link when `href` is set, otherwise a greyed-out placeholder explaining why. */
function OptionalLink({ href, missingTitle, children }: { href?: string; missingTitle: string; children: ReactNode }) {
  if (!href) {
    return (
      <span className={cn(base, disabled)} title={missingTitle} aria-disabled>
        {children}
      </span>
    )
  }
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={cn(base, enabled)}>
      {children}
    </a>
  )
}

/** Live demo button, plus a repository button only when a GitHub link is set. */
export function ProjectLinks({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.github && (
        <OptionalLink href={project.github} missingTitle="Repository link not added yet">
          <GithubIcon size={15} /> {compact ? 'Code' : 'Repository'}
        </OptionalLink>
      )}
      <OptionalLink href={project.demo} missingTitle="Live demo not available yet">
        <ExternalLink size={15} /> Live Demo
      </OptionalLink>
    </div>
  )
}
