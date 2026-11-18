import profilePhoto from '../assets/profile.png'

/**
 * ─────────────────────────────────────────────────────────────
 *  PROFILE — edit everything about you here.
 *  Every section of the site reads from the files in /src/data.
 * ─────────────────────────────────────────────────────────────
 */
export const profile = {
  fullName: 'Jevy Paul C. Batuto',
  shortName: 'Jevy',
  initials: 'JB',
  role: 'Computer Science Student',
  intro:
    'Progress Over Perfection, Learning Through Experience.',
  /** Printed on the ID card. */
  location: 'Philippines',

  /** Put your photo in /src/assets, import it at the top of this file, and set it here. Empty = placeholder. */
  photo: profilePhoto,

  /**
   * Put your resume in /public (e.g. /public/resume.pdf) and set 'resume.pdf' (no leading slash,
   * so it also works when opening dist/index.html directly). Empty = button shows "soon".
   */
  resumeUrl: '',

  email: 'jvybatuto@gmail.com',
  socials: {
    github: 'https://github.com/your-username',
    linkedin: 'https://www.linkedin.com/in/your-username',
    // Replace with your exact profile link (e.g. https://www.facebook.com/your.profile) for a direct link.
    facebook: 'https://www.facebook.com/search/top?q=Jevy%20Paul%20Batuto', // set to '' to hide
    facebookName: 'Jevy Paul Batuto',
  },

  /** Text printed on the hanging ID card. */
  card: {
    institution: 'Biliran Province State University',
    department: 'College of Computer Studies',
    idNumber: '23-1-00814',
    /** Optional. Shown on the card when filled, e.g. '02-28-05'. Leave '' to keep it private. */
    birthday: '',
    issued: '08 / 2026',
    validThru: '05 / 2027',
    program: 'BS Computer Science',
  },
}

export type Profile = typeof profile
