import { Download, FileText } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { profile } from '../../data/profile'
import { cn } from '../../lib/cn'
import { Modal } from '../ui/Modal'
import { ResumeSheet } from './ResumeSheet'

/**
 * "Resume" button that opens the resume in a modal. "Download PDF" uses the browser's print dialog
 * (choose "Save as PDF"); while the modal is open a print-only copy is mounted so only the resume prints
 * (see "Resume printing" in index.css).
 */
export function ResumeButton({ className, onOpen }: { className?: string; onOpen?: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onOpen?.()
          setOpen(true)
        }}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-md border border-crimson/60 px-4 text-[14px] font-semibold text-mist-100 transition-colors hover:bg-crimson hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson',
          className,
        )}
      >
        <FileText size={16} /> Resume
      </button>

      <Modal open={open} onClose={() => setOpen(false)} label={`${profile.fullName} resume`} maxWidth="max-w-4xl">
        {/* toolbar (right padding leaves room for the modal's close button) */}
        <div className="sticky top-0 z-[5] flex items-center gap-3 border-b border-ink-600 bg-ink-900/95 py-3 pl-5 pr-16 backdrop-blur">
          <p className="font-display text-base font-semibold text-mist-100">Resume</p>
          <button
            type="button"
            onClick={() => window.print()}
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-md bg-crimson px-4 text-[14px] font-semibold text-white transition-colors hover:bg-crimson-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
        <div className="p-3 sm:p-5">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <ResumeSheet />
          </div>
        </div>
      </Modal>

      {open &&
        createPortal(
          <div className="resume-print-root">
            <ResumeSheet />
          </div>,
          document.body,
        )}
    </>
  )
}
