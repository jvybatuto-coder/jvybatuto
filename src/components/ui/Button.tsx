import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary:
    'bg-crimson text-white shadow-[0_0_0_1px_rgba(200,16,46,0.4),0_8px_30px_-12px_rgba(200,16,46,0.7)] hover:bg-crimson-light hover:shadow-[0_0_0_1px_rgba(224,36,63,0.6),0_10px_40px_-12px_rgba(200,16,46,0.9)]',
  secondary: 'border border-ink-500 bg-ink-800/60 text-mist-100 hover:border-mist-600 hover:bg-ink-700',
  ghost: 'text-mist-300 hover:text-mist-100',
}

interface Common {
  variant?: Variant
  children: ReactNode
  className?: string
}

export function Button({ variant = 'primary', className, children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  )
}

export function LinkButton({
  variant = 'primary',
  className,
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  )
}
