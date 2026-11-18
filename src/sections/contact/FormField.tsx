import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** Input/textarea classes, with a red border when invalid. */
export const inputClass = (invalid: boolean) =>
  cn(
    'min-h-[46px] w-full rounded-md border bg-ink-950 px-3.5 text-[15px] text-mist-100 placeholder:text-mist-600 transition-colors focus:outline-none focus:ring-2',
    invalid
      ? 'border-crimson/70 focus:ring-crimson/40'
      : 'border-ink-600 hover:border-ink-500 focus:border-crimson/60 focus:ring-crimson/20',
  )

interface FormFieldProps {
  /** id of the control inside; the label and the error message are linked to it. */
  inputId: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

/** Label + control + error message. */
export function FormField({ inputId, label, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={inputId} className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist-400">
          {label}
        </label>
        {hint && <span className="font-mono text-[10px] text-mist-600">{hint}</span>}
      </div>
      {children}
      <p id={`${inputId}-err`} className={cn('mt-1.5 text-xs text-crimson-light', !error && 'sr-only')}>
        {error ?? ''}
      </p>
    </div>
  )
}
