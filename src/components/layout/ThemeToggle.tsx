import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/cn'

/** Sun/moon button that switches between the dark and light themes. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const light = theme === 'light'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      title={light ? 'Dark mode' : 'Light mode'}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-md border border-ink-600 text-mist-400 transition-colors hover:border-crimson/60 hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson',
        className,
      )}
    >
      {light ? <Moon size={17} strokeWidth={1.8} /> : <Sun size={17} strokeWidth={1.8} />}
    </button>
  )
}
