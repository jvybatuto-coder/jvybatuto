import { AlertCircle, CheckCircle2, Info, Loader2, Send } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { profile } from '../../data/profile'
import { cn } from '../../lib/cn'
import { FormField, inputClass } from './FormField'
import { Notice } from './Notice'
import {
  buildMailto,
  EMPTY_FIELDS,
  MESSAGE_MAX_LENGTH,
  validate,
  type ContactErrors,
  type ContactFields,
  type FieldName,
} from './validation'

/**
 * The form POSTs JSON to VITE_CONTACT_ENDPOINT (e.g. a Formspree / Getform URL).
 * If no endpoint is configured, it says so honestly and offers to open the
 * visitor's email app with the message pre-filled instead.
 */
const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined)?.trim() || ''

type Status = 'idle' | 'sending' | 'success' | 'error' | 'unconfigured'

const ALL_TOUCHED: Record<FieldName, boolean> = { name: true, email: true, subject: true, message: true }

export function ContactForm() {
  const [fields, setFields] = useState<ContactFields>(EMPTY_FIELDS)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [honeypot, setHoneypot] = useState('')

  const mailto = buildMailto(profile.email, fields)

  const onChange = (name: FieldName) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...fields, [name]: e.target.value }
    setFields(next)
    if (touched[name]) setErrors(validate(next))
    if (status !== 'idle' && status !== 'sending') setStatus('idle')
  }

  const onBlur = (name: FieldName) => () => {
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate(fields))
  }

  const errorFor = (name: FieldName) => (touched[name] ? errors[name] : undefined)

  /** Props shared by every control: value, handlers, styling and accessibility wiring. */
  const controlProps = (name: FieldName, extraClass?: string) => {
    const invalid = !!errorFor(name)
    return {
      id: `cf-${name}`,
      value: fields[name],
      onChange: onChange(name),
      onBlur: onBlur(name),
      className: cn(inputClass(invalid), extraClass),
      'aria-invalid': invalid,
      'aria-describedby': `cf-${name}-err`,
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validate(fields)
    setErrors(found)
    setTouched(ALL_TOUCHED)

    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      document.getElementById(`cf-${firstInvalid}`)?.focus()
      return
    }
    if (honeypot) return // filled in by a bot
    if (!ENDPOINT) {
      setStatus('unconfigured')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('success')
      setFields(EMPTY_FIELDS)
      setTouched({})
    } catch {
      setStatus('error')
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="card-surface p-6 sm:p-8" aria-describedby="cf-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField inputId="cf-name" label="Name" error={errorFor('name')}>
          <input autoComplete="name" {...controlProps('name')} />
        </FormField>
        <FormField inputId="cf-email" label="Email" error={errorFor('email')}>
          <input type="email" autoComplete="email" inputMode="email" {...controlProps('email')} />
        </FormField>
      </div>

      <div className="mt-5">
        <FormField inputId="cf-subject" label="Subject" error={errorFor('subject')}>
          <input {...controlProps('subject')} />
        </FormField>
      </div>

      <div className="mt-5">
        <FormField
          inputId="cf-message"
          label="Message"
          error={errorFor('message')}
          hint={`${fields.message.length}/${MESSAGE_MAX_LENGTH}`}
        >
          <textarea rows={6} {...controlProps('message', 'resize-y py-3')} />
        </FormField>
      </div>

      {/* honeypot: hidden from people, bots fill it in */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </Button>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist-600">All fields required</p>
      </div>

      <div id="cf-status" aria-live="polite" className="mt-5">
        {status === 'success' && (
          <Notice tone="success" icon={<CheckCircle2 size={18} />}>
            Message sent. Thank you, I will get back to you soon.
          </Notice>
        )}
        {status === 'error' && (
          <Notice tone="error" icon={<AlertCircle size={18} />}>
            Something went wrong and the message was not sent. Please try again, or{' '}
            <a href={mailto} className="underline underline-offset-2 hover:text-mist-100">
              email me directly
            </a>
            .
          </Notice>
        )}
        {status === 'unconfigured' && (
          <Notice tone="info" icon={<Info size={18} />}>
            Online sending isn't set up yet, so this message has <strong>not</strong> been sent.{' '}
            <a href={mailto} className="font-medium text-mist-100 underline underline-offset-2 hover:text-mist-100">
              Open it in your email app
            </a>{' '}
            to send it instead.
          </Notice>
        )}
      </div>
    </form>
  )
}
