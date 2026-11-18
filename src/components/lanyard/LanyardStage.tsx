import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { profile } from '../../data/profile'

const Lanyard = lazy(() => import('./Lanyard'))

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Loads the WebGL lanyard lazily; falls back to a static card when WebGL isn't available. */
export function LanyardStage({ reducedMotion, compact }: { reducedMotion: boolean; compact: boolean }) {
  const [gl, setGl] = useState<boolean | null>(null)
  useEffect(() => setGl(webglAvailable()), [])

  const fallback = <StaticCard />
  if (gl === null) return <Loading />
  if (!gl) return fallback

  return (
    <Boundary fallback={fallback}>
      <Suspense fallback={<Loading />}>
        <Lanyard reducedMotion={reducedMotion} compact={compact} />
      </Suspense>
    </Boundary>
  )
}

function Loading() {
  return (
    <div className="flex h-full w-full items-start justify-center" aria-hidden>
      <div className="flex flex-col items-center">
        <div className="h-[34vh] w-[3px] bg-gradient-to-b from-transparent to-ink-600" />
        <div className="h-[260px] w-[170px] animate-pulse rounded-lg border border-ink-600 bg-ink-800/60" />
      </div>
    </div>
  )
}

/** Non-WebGL fallback: a flat rendition of the same card. */
function StaticCard() {
  const c = profile.card
  return (
    <div className="flex h-full w-full items-start justify-center" role="img" aria-label={`ID card for ${profile.fullName}`}>
      <div className="flex flex-col items-center">
        <div className="h-[30vh] w-6 border-x border-ink-600 bg-[repeating-linear-gradient(135deg,#0c0c0d_0_3px,#151517_3px_5px)]" />
        <div className="h-3 w-7 rounded-sm bg-mist-500" />
        <div className="relative w-[230px] overflow-hidden rounded-lg border border-ink-500 bg-gradient-to-br from-[#16161a] to-[#09090a] shadow-2xl">
          <div className="border-b border-ink-600 bg-black/50 p-4">
            <p className="font-display text-sm font-bold uppercase tracking-wider text-mist-100">{c.institution}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-mist-500">{c.department}</p>
          </div>
          <div className="flex gap-3 p-4">
            <div className="h-24 w-20 rounded bg-ink-700" />
            <div className="font-mono text-[9px] text-mist-500">
              ID NO.<p className="text-[11px] text-mist-100">{c.idNumber}</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <p className="font-display text-lg font-bold uppercase leading-tight text-mist-100">{profile.fullName}</p>
            <p className="text-xs text-mist-300">{profile.role}</p>
          </div>
          <div className="h-5 bg-gradient-to-r from-crimson-dark to-crimson" />
        </div>
      </div>
    </div>
  )
}
