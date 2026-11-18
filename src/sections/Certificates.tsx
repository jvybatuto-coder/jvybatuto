import { Award, ExternalLink, ImageOff, Maximize2 } from 'lucide-react'
import { useEffect, useLayoutEffect, useState, type CSSProperties } from 'react'
import { Modal } from '../components/ui/Modal'
import { Section } from '../components/ui/Section'
import { certificates, type Certificate } from '../data/certificates'
import { useInView } from '../hooks/useInView'
import { cn } from '../lib/cn'

function CertificateImage({ cert, full = false }: { cert: Certificate; full?: boolean }) {
  if (cert.image) {
    return (
      <img
        src={cert.image}
        alt={`${cert.title} certificate`}
        loading={full ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(full ? 'h-auto max-h-[75vh] w-full object-contain' : 'h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]')}
      />
    )
  }
  return (
    <div className={cn('flex w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,rgb(var(--ink-800)),rgb(var(--ink-900)))]', full ? 'aspect-[1.414/1]' : 'h-full')}>
      <div className="absolute inset-4 rounded border border-dashed border-ink-600" aria-hidden />
      {full ? <ImageOff size={28} strokeWidth={1.4} className="text-mist-600" /> : <Award size={28} strokeWidth={1.4} className="text-mist-600" />}
      <span className="font-mono text-[10px] uppercase tracking-label text-mist-600">
        {full ? 'Certificate image not uploaded yet' : 'Certificate pending upload'}
      </span>
    </div>
  )
}

/** Small fixed tilt per card for the stacked look (-4deg..4deg), cycling so it never looks random. */
const TILTS = [-3, 2.5, -1.5, 3.5, -4, 1.5]

/** Content inside a card waits for the card's own delay plus `ms`. */
const at = (ms: number) => ({ '--at': `${ms}ms` }) as CSSProperties

/** Longest delay + duration of the spread, after which hover effects switch on. */
const SETTLE_MS = 1400 + certificates.length * 110 + 200

export function Certificates() {
  const [open, setOpen] = useState<Certificate | null>(null)
  // Cards start stacked at the grid's centre and spread to their real grid cells when it scrolls into view.
  const [gridRef, inView] = useInView<HTMLUListElement>(0.12)
  const [settled, setSettled] = useState(false)

  // Measure each card's offset from the grid centre using its layout position (offsetLeft/Top ignore
  // transforms), so the stack works for any card count and any column layout. Re-measured on resize.
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const measure = () => {
      const cx = grid.clientWidth / 2
      const cy = grid.clientHeight / 2
      for (const el of Array.from(grid.children) as HTMLElement[]) {
        el.style.setProperty('--cx', `${cx - (el.offsetLeft + el.offsetWidth / 2)}px`)
        el.style.setProperty('--cy', `${cy - (el.offsetTop + el.offsetHeight / 2)}px`)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(grid)
    return () => ro.disconnect()
  }, [gridRef])

  useEffect(() => {
    if (!inView) {
      setSettled(false)
      return
    }
    const t = window.setTimeout(() => setSettled(true), SETTLE_MS)
    return () => window.clearTimeout(t)
  }, [inView])

  return (
    <Section
      id="certificates"
     
      eyebrow="Certificates & Achievements"
      title="Certifications"
      highlight="Certifications"
      className="border-y border-ink-800 bg-ink-900/40"
    >
      <ul
        ref={gridRef}
        className={cn('cert-grid relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3', inView && 'is-visible', settled && 'is-settled')}
      >
        {certificates.map((c, i) => (
          <li
            key={c.id}
            className="cert-item"
            style={{ '--i': i, '--rot': `${TILTS[i % TILTS.length]}deg`, zIndex: certificates.length - i } as CSSProperties}
          >
              <button
                onClick={() => setOpen(c)}
                className="card-surface group block h-full w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
                aria-label={`Open certificate: ${c.title}`}
              >
                <div className="relative aspect-[1.414/1] overflow-hidden border-b border-ink-700">
                  <CertificateImage cert={c} />
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-ink-600 bg-ink-950/80 text-mist-400 opacity-0 transition-opacity group-hover:opacity-100">
                    <Maximize2 size={14} />
                  </span>
                </div>
                <div className="p-5">
                  <p className="cert-step cert-category font-mono text-[10px] uppercase tracking-label text-crimson" style={at(450)}>
                    {c.category}
                  </p>
                  <h3 className="cert-step mt-2 font-display text-[16px] font-semibold text-mist-100" style={at(560)}>
                    {c.title}
                  </h3>
                  <p className="mt-1 flex items-center justify-between text-sm text-mist-500">
                    <span className="cert-step" style={at(670)}>{c.issuer}</span>
                    <span className="cert-step font-mono text-xs text-mist-600" style={at(780)}>{c.date}</span>
                  </p>
                </div>
              </button>
          </li>
        ))}
      </ul>

      <Modal open={!!open} onClose={() => setOpen(null)} label={open ? open.title : 'Certificate'} maxWidth="max-w-5xl">
        {open && (
          <div>
            <div className="relative bg-black">
              <CertificateImage cert={open} full />
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-ink-700 p-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-label text-crimson">{open.category}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-mist-100">{open.title}</h3>
                <p className="mt-1 text-sm text-mist-500">
                  {open.issuer} · {open.date}
                </p>
                {open.credentialId && (
                  <p className="mt-2 font-mono text-xs tracking-wider text-mist-500">
                    Credential ID: <span className="text-mist-300">{open.credentialId}</span>
                  </p>
                )}
              </div>
              {open.credentialUrl && (
                <a
                  href={open.credentialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-ink-600 px-4 text-sm text-mist-200 hover:border-crimson/60 hover:text-mist-100"
                >
                  <ExternalLink size={15} /> Verify credential
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Section>
  )
}
