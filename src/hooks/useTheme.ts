import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

/** Reads the theme set on <html> by the inline script in index.html (falls back to dark). */
function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement
  if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('theme-switching')
    window.setTimeout(() => root.classList.remove('theme-switching'), 400)
  }
  root.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f6f6f7' : '#050505')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* storage unavailable (private mode): the choice just isn't remembered */
  }
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }))
}

/** Current theme plus a toggle. The choice is remembered per browser. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  useEffect(() => {
    const onChange = (e: Event) => setTheme((e as CustomEvent<Theme>).detail)
    window.addEventListener('themechange', onChange)
    return () => window.removeEventListener('themechange', onChange)
  }, [])

  const toggle = useCallback(() => applyTheme(currentTheme() === 'light' ? 'dark' : 'light', true), [])

  return { theme, toggle }
}
