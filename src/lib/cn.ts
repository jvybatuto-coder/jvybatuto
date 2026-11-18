type ClassValue = string | false | null | undefined

/** Joins the truthy class names: cn('a', isActive && 'b') → 'a b'. */
export const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(' ')
