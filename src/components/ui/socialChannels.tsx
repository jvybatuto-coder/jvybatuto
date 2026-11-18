import { Mail } from 'lucide-react'
import type { ReactNode } from 'react'
import { profile } from '../../data/profile'
import { FacebookIcon } from './BrandIcons'

export interface SocialChannel {
  label: string
  href: string
  /** Human-readable value, e.g. "github.com/user". */
  display: string
  icon: ReactNode
}

/** Every way to reach you, built from profile.ts. Channels with an empty link are left out. */
export function getSocialChannels({ withEmail = false } = {}): SocialChannel[] {
  const { email, socials } = profile
  const channels: SocialChannel[] = [
    { label: 'Facebook', href: socials.facebook, display: socials.facebookName, icon: <FacebookIcon size={16} /> },
  ]
  if (withEmail) channels.unshift({ label: 'Email', href: `mailto:${email}`, display: email, icon: <Mail size={17} /> })
  return channels.filter((c) => c.href)
}
