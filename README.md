# Jevy Paul C. Batuto — Portfolio

React + TypeScript + Tailwind CSS + Framer Motion, with a physics-simulated 3D lanyard
(Three.js / React Three Fiber / Rapier).

## Run

```bash
npm install
npm run dev       # live-reloading dev server at http://localhost:5173
npm run build     # builds ONE self-contained file: dist/index.html
npm run preview   # serve the build at http://localhost:4173
```

`npm run build` inlines all scripts, styles and imported images into `dist/index.html`,
so you can open it with a plain **double-click**. Rebuild after every change.

## Editing content

All content lives in **`src/data/`**. You never need to touch the components.

| File | What it controls |
| --- | --- |
| `profile.ts` | Name, role, intro, email, socials, photo, resume, **ID-card text** |
| `about.ts` | About bio + quick facts |
| `skills.ts` | Skill categories. `level` is optional and only shown when you set it |
| `capabilities.ts` | "What I can do" cards |
| `interests.ts` | Areas of interest |
| `projects.ts` | Project cards and the details modal |
| `education.ts` | Education timeline |
| `certificates.ts` | Certificate gallery |
| `experience.ts` | Experience list (section is built but not shown; add `<Experience />` in `App.tsx` to enable) |
| `navigation.ts` | Navbar links |

### Images

Images go in **`src/assets/`** and are **imported** in the data file, so they get embedded in the build:

```ts
// src/data/certificates.ts
import awsCert from '../assets/certificates/aws.jpg'
// ...
image: awsCert,
```

- **Profile photo:** `src/assets/profile.png` (imported in `profile.ts`). It appears in About **and is printed on the 3D ID card**.
- **Certificates:** `src/assets/certificates/`, imported in `certificates.ts`.
- **Project screenshots:** `src/assets/projects/`, imported in `projects.ts`.
- **Resume:** `public/resume.pdf`, then set `resumeUrl: 'resume.pdf'` (no leading slash).

Links left as `''` (GitHub repo, live demo, resume) show as unavailable instead of pointing nowhere.

## Contact form

The form validates input and **does not pretend to send** without a backend.
To make it send, create a free form endpoint (e.g. Formspree), then:

```bash
cp .env.example .env
# set VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxx
```

Without it, visitors are told the message wasn't sent and get a pre-filled email link instead.

## Structure

```
src/
  main.tsx, App.tsx       Entry point and page layout (section order)
  index.css               Tailwind layers + shared component classes
  assets/                 Images embedded into the build
  data/                   All editable content (one file per section)
  sections/               One component per page section
    contact/              Contact section, form, validation, field + notice components
    projects/             Projects section, card, cover, links, details modal
  components/
    layout/               Navbar, Footer, CursorGlow
    ui/                   Reusable pieces: Section, Reveal, Button, Modal, BulletList, SocialLinks, icons
    lanyard/              3D lanyard: LanyardStage (lazy loader + fallback), Lanyard (physics),
                          IdCard, Strap, textures (canvas-drawn card & strap)
  hooks/                  useActiveSection, useMediaQuery
  lib/                    Small helpers: cn (class names), format, motion (easing), scroll
```
