import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Section } from '../../components/ui/Section'
import { projects } from '../../data/projects'
import { ProjectCard } from './ProjectCard'
import { ProjectDetails } from './ProjectDetails'

export function Projects() {
  const [openId, setOpenId] = useState<string | null>(null)
  const opened = projects.find((p) => p.id === openId)

  return (
    <Section
      id="projects"
     
      eyebrow="Featured Projects"
      title="Selected work"
      highlight="work"
    >
      {/* every project uses the same full-width featured layout; each card runs its own entrance (ProjectCard) */}
      <div className="grid gap-5">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} featured onOpen={() => setOpenId(p.id)} />
        ))}
      </div>

      <Modal
        open={!!opened}
        onClose={() => setOpenId(null)}
        label={opened ? `${opened.name} details` : 'Project details'}
      >
        {opened && <ProjectDetails project={opened} />}
      </Modal>
    </Section>
  )
}
