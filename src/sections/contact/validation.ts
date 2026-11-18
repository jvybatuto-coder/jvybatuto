export interface ContactFields {
  name: string
  email: string
  subject: string
  message: string
}

export type FieldName = keyof ContactFields
export type ContactErrors = Partial<Record<FieldName, string>>

export const EMPTY_FIELDS: ContactFields = { name: '', email: '', subject: '', message: '' }
export const MESSAGE_MAX_LENGTH = 2000

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Returns an error message for every invalid field (empty object = valid). */
export function validate(f: ContactFields): ContactErrors {
  const errors: ContactErrors = {}
  if (f.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(f.email.trim())) errors.email = 'Please enter a valid email address.'
  if (f.subject.trim().length < 3) errors.subject = 'Subject should be at least 3 characters.'
  if (f.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  else if (f.message.length > MESSAGE_MAX_LENGTH) errors.message = `Message is limited to ${MESSAGE_MAX_LENGTH} characters.`
  return errors
}

/** mailto: link with the message pre-filled, used when online sending isn't available. */
export function buildMailto(to: string, f: ContactFields) {
  const body = `${f.message}\n\n— ${f.name} (${f.email})`
  return `mailto:${to}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(body)}`
}
