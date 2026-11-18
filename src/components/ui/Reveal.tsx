import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE_OUT } from '../../lib/motion'

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'article'
}

/** Fades and lifts content into view once. */
export function Reveal({ children, delay = 0, y = 18, className, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: reduce ? 0.2 : 0.7, delay: reduce ? 0 : delay, ease: EASE_OUT }}
    >
      {children}
    </Comp>
  )
}
