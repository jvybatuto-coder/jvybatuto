/** EXPERIENCE — placeholders. Internships, org roles, freelance or volunteer work. */
export interface ExperienceEntry {
  role: string
  organization: string
  type: string
  period: string
  points: string[]
  tags?: string[]
}

export const experience: ExperienceEntry[] = [
  {
    role: '[Role / Position]',
    organization: '[Organization or Company]',
    type: '[Internship / Organization / Freelance]',
    period: '[Month Year] — [Month Year]',
    points: ['[What you worked on or were responsible for]', '[A tool, process or skill you used]'],
    tags: ['[Tech]', '[Tech]'],
  },
  {
    role: '[Role / Position]',
    organization: '[Student Organization]',
    type: '[Organization]',
    period: '[Month Year] — Present',
    points: ['[Responsibility or contribution]'],
  },
]
