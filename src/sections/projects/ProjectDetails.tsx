import { Layers } from 'lucide-react'
import { BulletList } from '../../components/ui/BulletList'
import type { Project } from '../../data/projects'
import { ProjectCover } from './ProjectCover'
import { ProjectLinks } from './ProjectLinks'

/** Full project write-up shown inside the modal. */
export function ProjectDetails({ project }: { project: Project }) {
  return (
    <div>
      <div className="aspect-[16/8] overflow-hidden border-b border-ink-700">
        <ProjectCover project={project} large />
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-label">
          <span className="text-crimson">Project {project.index}</span>
          <span className="text-mist-600">/</span>
          <span className="text-mist-500">{project.category}</span>
          {project.year && (
            <>
              <span className="text-mist-600">/</span>
              <span className="text-mist-500">{project.year}</span>
            </>
          )}
        </div>
        <h3 className="mt-3 font-display text-3xl font-semibold text-mist-100">{project.name}</h3>
        <p className="mt-2 text-mist-300">{project.summary}</p>
        {project.description && <p className="mt-5 leading-relaxed text-mist-400">{project.description}</p>}

        <h4 className="mt-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-label text-mist-500">
          <Layers size={14} className="text-crimson" /> Highlights
        </h4>
        <BulletList items={project.highlights} className="mt-3" itemClassName="text-[15px] text-mist-300" />

        <h4 className="mt-8 font-mono text-[11px] uppercase tracking-label text-mist-500">Built with</h4>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <li key={t} className="rounded border border-ink-600 bg-ink-850 px-2.5 py-1 font-mono text-xs text-mist-300">
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-ink-700 pt-6">
          <ProjectLinks project={project} />
        </div>
      </div>
    </div>
  )
}
