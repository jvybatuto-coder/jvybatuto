/**
 * RESUME — the text of the printable resume (opened from the "Resume" button in the header).
 * Name, photo and email come from profile.ts; certificates come from certificates.ts.
 */
export const resume = {
  headline: '4th-Year BS Computer Science Student · Biliran Province State University',
  focus: 'Aspiring Web Developer · Networking',
  location: 'Philippines',

  about: [
    'I am a 4th-year Bachelor of Science in Computer Science student at Biliran Province State University (BiPSU), interested in networking and web design.',
    'I enjoy building web systems that solve practical problems, such as DailyFish, an online fish ordering platform, and NUMIFY, a gamified numeracy assessment system for junior high school students.',
    'I am actively seeking an OJT / internship in networking or web development, where I can apply what I have learned and grow through hands-on industry experience.',
  ],

  techStack: [
    { label: 'Languages', items: ['Python', 'JavaScript'] },
    { label: 'Web Development', items: ['HTML', 'CSS', 'Django'] },
    { label: 'Database', items: ['PostgreSQL'] },
  ],

  experience: [
    { title: 'BS Computer Science – 4th Year', place: 'Biliran Province State University', when: 'Present' },
    { title: 'OJT / Internship – Actively Seeking', place: 'Preferably in Networking or Web Development', when: 'Open' },
  ],

  goals: [
    'Start my career through an OJT in networking or web development.',
    'Strengthen my networking skills and build reliable, user-friendly web applications through hands-on experience and continuous learning.',
  ],

  projects: [
    {
      name: 'DailyFish',
      tech: ['Python', 'Django', 'PostgreSQL'],
      summary:
        'Online fish ordering and e-commerce platform that lets customers view available fish, place orders online, and buy fish without going to the market.',
      role: 'System Developer',
    },
    {
      name: 'NUMIFY',
      tech: ['Python', 'Django', 'PostgreSQL'],
      summary:
        'A teacher-assisted gamified numeracy assessment system for junior high school students, with teacher-managed math assessments, automated scoring, and points, badges, and progress tracking.',
      role: 'System Developer',
    },
    {
      name: 'Portfolio Website',
      tech: ['React', 'TypeScript', 'Tailwind CSS'],
      summary: 'Personal portfolio with an interactive 3D ID card, light and dark mode, and a responsive layout for desktop and mobile.',
    },
  ],
}
