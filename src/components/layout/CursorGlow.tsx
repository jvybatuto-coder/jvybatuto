import { useEffect, useRef } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

/** Soft crimson light that trails the cursor. Desktop pointers only; off for reduced motion. */
export function CursorGlow() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fine || reduce) return
    let x = window.innerWidth / 2
    let y = window.innerHeight / 3
    let tx = x
    let ty = y
    let raf = 0
    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (ref.current) ref.current.style.opacity = '1'
    }
    const onLeave = () => ref.current && (ref.current.style.opacity = '0')
    const tick = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      if (ref.current) ref.current.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [fine, reduce])

  if (!fine || reduce) return null
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] rounded-full opacity-0 transition-opacity duration-500"
      style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.07) 0%, rgba(139,0,0,0.035) 35%, transparent 70%)' }}
    />
  )
}
