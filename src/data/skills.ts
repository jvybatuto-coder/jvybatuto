/**
 * SKILLS — the technologies shown in the Skills section, in display order.
 *
 * Logos are official SVGs (from Devicon) stored in /src/assets/tech and inlined as markup,
 * so the Django wordmark can get a theme-aware outline in CSS.
 * width: the logo's display width in px on large desktops; smaller screens scale it down.
 */
import css from '../assets/tech/css3-original.svg?raw'
import django from '../assets/tech/django-plain-wordmark.svg?raw'
import html from '../assets/tech/html5-original.svg?raw'
import javascript from '../assets/tech/javascript-original.svg?raw'
import postgresql from '../assets/tech/postgresql-original.svg?raw'
import python from '../assets/tech/python-original.svg?raw'

export interface Tech {
  id: string
  name: string
  /** Raw SVG markup of the official logo. */
  logo: string
  width: number
}

export const technologies: Tech[] = [
  { id: 'html', name: 'HTML', logo: html, width: 86 },
  { id: 'css', name: 'CSS', logo: css, width: 86 },
  { id: 'javascript', name: 'JavaScript', logo: javascript, width: 90 },
  { id: 'python', name: 'Python', logo: python, width: 98 },
  { id: 'django', name: 'Django', logo: django, width: 145 },
  { id: 'postgresql', name: 'PostgreSQL', logo: postgresql, width: 95 },
]
