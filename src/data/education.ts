/** EDUCATION — editable placeholder timeline. */
export interface EducationEntry {
  institution: string
  degree: string
  period: string
  location?: string
  current?: boolean
  coursework?: string[]
  milestones?: string[]
}

export const education: EducationEntry[] = [
  {
    institution: '[University / College Name]',
    degree: 'Bachelor of Science in Computer Science',
    period: '[20XX] — Present',
    location: '[City, Province]',
    current: true,
    coursework: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'Database Systems',
      'Software Engineering',
      'Web Development',
      'Operating Systems',
    ],
    milestones: ['[Academic milestone — e.g. capstone project defense]', '[Academic milestone]'],
  },
  {
    institution: '[Senior High School Name]',
    degree: '[Strand — e.g. STEM / ICT]',
    period: '[20XX] — [20XX]',
    location: '[City, Province]',
    milestones: ['[Milestone or recognition]'],
  },
]
