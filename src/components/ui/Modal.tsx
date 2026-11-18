import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { EASE_OUT } from '../../lib/motion'

interface Props {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  maxWidth?: string
}

/** Accessible modal: Esc to close, focus returned to trigger, body scroll locked. */
export function Modal({ open, onClose, label, children, maxWidth = 'max-w-3xl' }: Props) {
  const reduce = useReducedMotion()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        )
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('button')?.focus())
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className={`relative max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-xl border border-ink-600 bg-ink-900 shadow-2xl`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-md border border-ink-600 bg-ink-900/90 text-mist-300 transition-colors hover:border-crimson/60 hover:text-mist-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
