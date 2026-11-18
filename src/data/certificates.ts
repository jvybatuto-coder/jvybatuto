import aiLiteracyImg from '../assets/certificates/ai-literacy-responsible-use.jpg'
import thesisSeminarImg from '../assets/certificates/thesis-preparation-seminar.jpg'
import digiTalinoImg from '../assets/certificates/integrated-os-digi-talino.jpg'

/**
 * CERTIFICATES — placeholders until you upload yours.
 * 1. Put the image in /src/assets/certificates (jpg/png/webp).
 * 2. Import it at the top of this file and set image: yourImport.
 *    (Imported images get embedded in the build, so dist/index.html works on double-click.)
 */
export const certificateCategories = [
  'Technical Training',
  'Web Development',
  'Programming',
  'Seminars and Workshops',
  'Academic Achievements',
] as const

export type CertificateCategory = (typeof certificateCategories)[number]

export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  category: CertificateCategory
  image?: string
  credentialId?: string
  credentialUrl?: string
}

export const certificates: Certificate[] = [
  {
    id: 'ai-literacy',
    title: 'Introduction to AI Literacy and Responsible Use',
    issuer: 'Mapúa University × CHED (ACHIEVE)',
    date: 'September 2026',
    category: 'Technical Training',
    image: aiLiteracyImg,
    credentialId: 'WK0N8PQ74YZAA',
  },
  {
    id: 'thesis-preparation',
    title: 'Thesis Preparation with the Use of Trending Tools and Industry Practices',
    issuer: 'Biliran Province State University · Computer Science Society',
    date: 'October 2025',
    category: 'Seminars and Workshops',
    image: thesisSeminarImg,
  },
  {
    id: 'digi-talino',
    title: 'Integrated OS – Be More Digi-TALINO (Webinar)',
    issuer: 'Integrated Office Solutions, Inc.',
    date: 'September 2025',
    category: 'Seminars and Workshops',
    image: digiTalinoImg,
  },
]
