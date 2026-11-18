/** Height of the fixed navbar plus a little breathing room (matches `scroll-padding-top` in index.css). */
const NAV_OFFSET = 72

/**
 * Fired (synchronously) just before scrollToId measures its target, with the target id as `detail`.
 * Sections that change height on reveal (e.g. Skills) listen so they can settle first.
 */
export const NAVIGATE_EVENT = 'portfolio:navigate'

/** Smoothly scrolls to a section by id (instant when the user prefers reduced motion) and updates the URL hash. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail: id }))
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const top = id === 'home' ? 0 : el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  history.replaceState(null, '', `#${id}`)
}
