import { cn } from '../../lib/cn'

interface BulletListProps {
  items: string[]
  className?: string
  /** Text styles for each item. */
  itemClassName?: string
}

/** List with short crimson dashes as bullets (milestones, highlights, responsibilities). */
export function BulletList({ items, className, itemClassName = 'text-sm text-mist-300' }: BulletListProps) {
  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((item, i) => (
        <li key={`${i}-${item}`} className={cn('flex gap-3', itemClassName)}>
          <span className="mt-[0.6em] h-px w-3 shrink-0 bg-crimson" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}
