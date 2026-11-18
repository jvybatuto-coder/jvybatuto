import type { Project } from '../../data/projects'
import { cn } from '../../lib/cn'

/** Project screenshot, or a generated app-window wireframe when no image is set. */
export function ProjectCover({ project, large = false }: { project: Project; large?: boolean }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`${project.name} screenshot`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,rgb(var(--ink-800)),rgb(var(--ink-900)))]" aria-hidden>
      <div className="bg-grid absolute inset-0 opacity-70" />
      <div className="absolute inset-x-[10%] top-[16%] bottom-[-8%] rounded-t-lg border border-ink-600 bg-ink-900/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:-translate-y-2">
        {/* window title bar */}
        <div className="flex items-center gap-1.5 border-b border-ink-700 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-ink-500" />
          <span className="h-2 w-2 rounded-full bg-ink-500" />
          <span className="h-2 w-2 rounded-full bg-crimson/70" />
          <span className="ml-3 h-1.5 w-1/3 rounded-full bg-ink-700" />
        </div>
        {/* sidebar + content blocks */}
        <div className="grid grid-cols-[1fr_3fr] gap-3 p-3">
          <div className="space-y-2">
            {[70, 55, 80, 45].map((w) => (
              <div key={w} className="h-1.5 rounded-full bg-ink-700" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="space-y-2.5">
            <div className={cn('rounded bg-ink-800', large ? 'h-16' : 'h-10')} />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 rounded bg-ink-800" />
              <div className="h-8 rounded bg-ink-800" />
              <div className="h-8 rounded border border-crimson/30 bg-crimson/10" />
            </div>
            <div className="h-1.5 w-2/3 rounded-full bg-ink-700" />
          </div>
        </div>
      </div>
      <span className="absolute left-5 top-4 font-mono text-[10px] uppercase tracking-label text-mist-600">
        P/{project.index}
      </span>
      <span className="absolute right-5 top-3 font-display text-4xl font-bold text-mist-100/[0.05]">{project.index}</span>
    </div>
  )
}
