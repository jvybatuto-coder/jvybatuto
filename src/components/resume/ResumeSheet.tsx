import type { ReactNode } from 'react'
import { certificates } from '../../data/certificates'
import { profile } from '../../data/profile'
import { resume } from '../../data/resume'

/**
 * The resume as a clean white document. It always uses fixed paper colours (not the site theme)
 * so it looks the same on screen, in dark mode and when printed / saved as PDF.
 * Layout: section labels in a narrow left column, content on the right.
 */
export function ResumeSheet() {
  return (
    <article className="resume-sheet bg-white px-6 py-8 font-sans text-[14px] font-medium leading-relaxed text-zinc-900 antialiased sm:px-12 sm:py-12 print:px-1 print:py-0 print:text-[11.5px] print:leading-normal">
      {/* header */}
      <header className="flex items-start justify-between gap-6 border-b-2 border-zinc-900 pb-6 print:pb-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.4rem)] font-bold leading-tight text-zinc-950 print:text-[26px]">
            {profile.fullName}
          </h1>
          <p className="mt-1.5 text-[14px] font-semibold text-zinc-800 print:text-[11.5px]">{resume.headline}</p>
          <p className="mt-1 text-[14px] font-bold text-zinc-950 print:text-[11.5px]">{resume.focus}</p>
          <p className="mt-3 text-[13px] font-semibold text-zinc-800 print:text-[11px]">
            <a href={`mailto:${profile.email}`} className="font-semibold text-zinc-950 underline decoration-zinc-400 underline-offset-2">
              {profile.email}
            </a>
            <span className="mx-2 text-zinc-400">|</span>
            {resume.location}
          </p>
        </div>
        {profile.photo && (
          <img
            src={profile.photo}
            alt={`Photo of ${profile.fullName}`}
            className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-zinc-200 sm:h-28 sm:w-28 print:h-20 print:w-20"
          />
        )}
      </header>

      <Row label="About">
        {resume.about.map((p) => (
          <p key={p.slice(0, 24)} className="mb-2 last:mb-0">
            {p}
          </p>
        ))}
      </Row>

      <Row label="Tech Stack">
        <dl className="grid grid-cols-[9rem_1fr] gap-y-1">
          {resume.techStack.map((g) => (
            <div key={g.label} className="contents">
              <dt className="font-bold text-zinc-950">{g.label}</dt>
              <dd>{g.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </Row>

      <Row label="Experience">
        <ul className="space-y-3">
          {resume.experience.map((e) => (
            <li key={e.title}>
              <Line title={e.title} aside={e.when} />
              <p className="text-zinc-800">{e.place}</p>
            </li>
          ))}
        </ul>
      </Row>

      <Row label="Goals">
        <ul className="list-disc space-y-1 pl-4 marker:text-zinc-900">
          {resume.goals.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </Row>

      <Row label="Projects">
        <ul className="space-y-3.5">
          {resume.projects.map((p) => (
            <li key={p.name}>
              <Line title={p.name} aside={p.tech.join(' · ')} />
              <p>
                {p.summary}
                {p.role && <span className="font-bold text-zinc-950"> Role: {p.role}.</span>}
              </p>
            </li>
          ))}
        </ul>
      </Row>

      <Row label="Certifications" last>
        <ul className="space-y-3">
          {certificates.map((c) => (
            <li key={c.id}>
              <Line title={c.title} aside={shortDate(c.date)} />
              <p className="text-zinc-800">
                {c.issuer}
                {c.credentialId && ` · Credential ID: ${c.credentialId}`}
              </p>
            </li>
          ))}
        </ul>
      </Row>
    </article>
  )
}

/** One resume section: label on the left (stacked above on small screens), content on the right. */
function Row({ label, children, last }: { label: string; children: ReactNode; last?: boolean }) {
  return (
    <section
      className={`grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6 print:grid-cols-[8rem_1fr] print:gap-5 print:py-3 ${last ? '' : 'border-b border-zinc-300'}`}
    >
      <h2 className="font-serif text-[16px] font-bold uppercase leading-snug tracking-wide text-zinc-950 print:text-[13px]">{label}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

/** Entry heading with a right-aligned note (date, status or tech). */
function Line({ title, aside }: { title: string; aside: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
      <h3 className="text-[15px] font-bold text-zinc-950 print:text-[12.5px]">{title}</h3>
      <span className="shrink-0 text-[12.5px] font-semibold text-zinc-700 print:text-[10.5px]">{aside}</span>
    </div>
  )
}

/** "September 2026" → "Sep 2026" */
function shortDate(date: string) {
  const [month, year] = date.split(' ')
  return month && year ? `${month.slice(0, 3)} ${year}` : date
}
