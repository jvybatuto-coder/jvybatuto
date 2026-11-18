import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'success' | 'error' | 'info'

const tones: Record<Tone, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-200',
  error: 'border-crimson/40 bg-crimson/[0.08] text-red-200',
  info: 'border-ink-500 bg-ink-800 text-mist-300',
}

/** Status message shown under the contact form. */
export function Notice({ tone, icon, children }: { tone: Tone; icon: ReactNode; children: ReactNode }) {
  return (
    <div
      className={cn('flex gap-3 rounded-md border px-4 py-3 text-sm leading-relaxed', tones[tone])}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <p>{children}</p>
    </div>
  )
}
