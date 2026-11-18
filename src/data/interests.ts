import { Boxes, BrainCircuit, Database, Globe, PenTool, ShieldCheck, Workflow, type LucideIcon } from 'lucide-react'

export interface Interest {
  title: string
  icon: LucideIcon
}

/** AREAS OF INTEREST — icons come from https://lucide.dev/icons */
export const interests: Interest[] = [
  { title: 'Software Engineering', icon: Workflow },
  { title: 'Web Development', icon: Globe },
  { title: 'Database Management', icon: Database },
  { title: 'UI/UX Design', icon: PenTool },
  { title: 'Cybersecurity', icon: ShieldCheck },
  { title: 'Artificial Intelligence', icon: BrainCircuit },
  { title: 'System Development', icon: Boxes },
]
