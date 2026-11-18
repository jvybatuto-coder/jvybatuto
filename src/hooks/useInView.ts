import { useEffect, useRef, useState } from 'react'

/**
 * Becomes true when at least `threshold` of the element is visible, and resets to false only once
 * the element has left the viewport completely, so entrance animations replay every time the
 * user scrolls back to it (up or down) without flickering while it is partly on screen.
 */
export function useInView<T extends Element>(threshold = 0.18) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) setInView(true)
        else if (!entry.isIntersecting) setInView(false)
      },
      { threshold: [0, threshold] },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView] as const
}
