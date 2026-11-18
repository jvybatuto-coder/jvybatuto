/** 1 → "01" */
export const pad2 = (n: number) => String(n).padStart(2, '0')

/** "https://www.github.com/user/" → "github.com/user" */
export const stripProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

/** Splits "Jevy Paul C. Batuto" into { first: "Jevy Paul C.", last: "Batuto" }. */
export function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  const last = parts.length > 1 ? parts.pop()! : ''
  return { first: parts.join(' '), last }
}

/** Link attributes: external links open in a new tab, mailto: links don't. */
export const linkTargetProps = (href: string) =>
  href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer noopener' }
