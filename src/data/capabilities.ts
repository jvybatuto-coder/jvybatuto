import { Boxes, Database, LayoutTemplate, MonitorSmartphone, PenTool, Server, type LucideIcon } from 'lucide-react'

export interface Capability {
  title: string
  description: string
  icon: LucideIcon
}

/** WHAT I CAN DO — icons come from https://lucide.dev/icons */
export const capabilities: Capability[] = [
  {
    title: 'Responsive Website Development',
    description: 'Layouts that adapt cleanly from large desktops down to small phones.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Database Design',
    description: 'Normalized relational schemas, relationships and practical queries.',
    icon: Database,
  },
  {
    title: 'System Development',
    description: 'Planning and building complete systems from requirements to a working build.',
    icon: Boxes,
  },
  {
    title: 'Frontend Development',
    description: 'Component-based interfaces with attention to detail and accessibility.',
    icon: LayoutTemplate,
  },
  {
    title: 'Backend Development',
    description: 'Server logic, authentication flows and REST endpoints.',
    icon: Server,
  },
  {
    title: 'UI Design & Prototyping',
    description: 'Wireframes and interactive prototypes before writing code.',
    icon: PenTool,
  },
]
