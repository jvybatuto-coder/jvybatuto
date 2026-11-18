/**
 * PROJECTS — placeholder showcase.
 * image:   put a screenshot in /src/assets, import it, and set image: yourImport. Empty = generated cover.
 * github / demo: leave '' until the link actually exists (the button shows as unavailable).
 */
import numifyImg from '../assets/projects/numify.jpg'
import dailyfishImg from '../assets/projects/dailyfish.jpg'

export interface Project {
  id: string
  index: string
  name: string
  category: string
  summary: string
  description?: string
  highlights: string[]
  tech: string[]
  image?: string
  github?: string
  demo?: string
  year?: string
}

export const projects: Project[] = [
  {
    id: 'dailyfish',
    index: '01',
    name: 'DailyFish',
    category: 'Application',
    summary:
      'DailyFish allows customers to view available fish products, place orders online, and purchase fish without the hassle of going to the market.',
    highlights: [
      'Online fish ordering and e-commerce platform.',
      'Convenient online fish ordering with less hassle.',
      'Role: System Developer',
    ],
    tech: ['Python', 'Django', 'PostgreSQL', 'HTML', 'CSS', 'JavaScript'],
    image: dailyfishImg,
    github: '',
    demo: '',
    year: '[Year]',
  },
  {
    id: 'numify',
    index: '02',
    name: 'NUMIFY',
    category: 'Web System',
    summary:
      'A Teacher-Assisted Gamified Numeracy Assessment System for Junior High School Students.',
    highlights: [
      'Teacher-managed math assessments and automated scoring.',
      'Gamified learning with points, badges, and progress tracking.',
      'Role: System Developer',
    ],
    tech: ['Python', 'Django', 'PostgreSQL', 'HTML', 'CSS', 'JavaScript'],
    image: numifyImg,
    github: '',
    demo: 'https://gamified-system.onrender.com',
    year: '[Year]',
  },
]
