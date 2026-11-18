import * as THREE from 'three'
import type { Profile } from '../../data/profile'
import { splitName, stripProtocol } from '../../lib/format'

/**
 * Procedural textures for the ID card and the woven lanyard strap.
 * Everything is drawn on <canvas> from the profile data, so the card
 * updates automatically when you edit src/data/profile.ts.
 */

const CRIMSON = '#C8102E'
const CRIMSON_LIGHT = '#E0243F'
const BLOOD = '#8B0000'

export const CARD_W = 1024
export const CARD_H = 1600
/** Supersampling factor for the card canvas: sharper text up close. */
const RES = 2

/* ───────────────────────── helpers ───────────────────────── */

type Ctx = CanvasRenderingContext2D

function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h) || 1
}

function rng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function spacing(ctx: Ctx, px: number) {
  // letterSpacing is supported in modern Chromium / Firefox / Safari 17+
  ;(ctx as Ctx & { letterSpacing?: string }).letterSpacing = `${px}px`
}

function text(
  ctx: Ctx,
  value: string,
  x: number,
  y: number,
  font: string,
  color: string,
  opts: { align?: CanvasTextAlign; tracking?: number } = {},
) {
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = opts.align ?? 'left'
  ctx.textBaseline = 'alphabetic'
  spacing(ctx, opts.tracking ?? 0)
  ctx.fillText(value, x, y)
  spacing(ctx, 0)
}

function fitFont(ctx: Ctx, value: string, weight: number, family: string, max: number, maxWidth: number, tracking = 0) {
  let size = max
  spacing(ctx, tracking)
  while (size > 20) {
    ctx.font = `${weight} ${size}px ${family}`
    if (ctx.measureText(value).width <= maxWidth) break
    size -= 2
  }
  spacing(ctx, 0)
  return `${weight} ${size}px ${family}`
}

function wrap(ctx: Ctx, value: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = value.split(' ')
  let line = ''
  let cy = y
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy)
      line = w
      cy += lineHeight
    } else line = test
  }
  if (line) ctx.fillText(line, x, cy)
  return cy
}

function background(ctx: Ctx) {
  const g = ctx.createLinearGradient(0, 0, CARD_W, CARD_H)
  g.addColorStop(0, '#16161a')
  g.addColorStop(0.55, '#0e0e10')
  g.addColorStop(1, '#09090a')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, CARD_W, CARD_H)

  // fine technical grid
  ctx.strokeStyle = 'rgba(255,255,255,0.025)'
  ctx.lineWidth = 1
  for (let x = 0; x <= CARD_W; x += 32) {
    ctx.beginPath()
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, CARD_H)
    ctx.stroke()
  }
  for (let y = 0; y <= CARD_H; y += 32) {
    ctx.beginPath()
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(CARD_W, y + 0.5)
    ctx.stroke()
  }

  // print grain
  const r = rng(7)
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(255,255,255,${r() * 0.025})`
    ctx.fillRect(r() * CARD_W, r() * CARD_H, 1.5, 1.5)
  }
}

function qr(ctx: Ctx, x: number, y: number, size: number, seed: string) {
  const n = 25
  const cell = size / n
  const pad = cell * 1.6
  ctx.fillStyle = '#ECECEE'
  roundRect(ctx, x - pad, y - pad, size + pad * 2, size + pad * 2, 10)
  ctx.fill()

  const fg = '#0B0B0C'
  const rand = rng(hash(seed))
  const inFinder = (i: number, j: number) =>
    (i < 8 && j < 8) || (i >= n - 8 && j < 8) || (i < 8 && j >= n - 8)

  ctx.fillStyle = fg
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (inFinder(i, j)) continue
      const timing = (i === 6 || j === 6) && (i + j) % 2 === 0
      if (timing || rand() > 0.54) ctx.fillRect(x + i * cell, y + j * cell, cell + 0.6, cell + 0.6)
    }
  }
  const finder = (cx: number, cy: number) => {
    ctx.fillStyle = fg
    ctx.fillRect(x + cx * cell, y + cy * cell, 7 * cell, 7 * cell)
    ctx.fillStyle = '#ECECEE'
    ctx.fillRect(x + (cx + 1) * cell, y + (cy + 1) * cell, 5 * cell, 5 * cell)
    ctx.fillStyle = fg
    ctx.fillRect(x + (cx + 2) * cell, y + (cy + 2) * cell, 3 * cell, 3 * cell)
  }
  finder(0, 0)
  finder(n - 7, 0)
  finder(0, n - 7)
}

function barcode(ctx: Ctx, x: number, y: number, w: number, h: number, seed: string) {
  const rand = rng(hash(seed) + 11)
  let cx = x
  ctx.fillStyle = '#D9D9DE'
  while (cx < x + w) {
    const bar = 2 + Math.floor(rand() * 4) * 2
    const gap = 2 + Math.floor(rand() * 3) * 2
    if (cx + bar > x + w) break
    ctx.fillRect(cx, y, bar, h)
    cx += bar + gap
  }
}

function silhouette(ctx: Ctx, x: number, y: number, w: number, h: number) {
  const g = ctx.createLinearGradient(0, y, 0, y + h)
  g.addColorStop(0, '#1d1d21')
  g.addColorStop(1, '#141417')
  ctx.fillStyle = g
  ctx.fillRect(x, y, w, h)

  ctx.fillStyle = '#2b2b30'
  const cx = x + w / 2
  // head
  ctx.beginPath()
  ctx.ellipse(cx, y + h * 0.38, w * 0.19, h * 0.17, 0, 0, Math.PI * 2)
  ctx.fill()
  // shoulders
  ctx.beginPath()
  ctx.moveTo(x + w * 0.08, y + h)
  ctx.bezierCurveTo(x + w * 0.1, y + h * 0.7, x + w * 0.3, y + h * 0.62, cx, y + h * 0.62)
  ctx.bezierCurveTo(x + w * 0.7, y + h * 0.62, x + w * 0.9, y + h * 0.7, x + w * 0.92, y + h)
  ctx.closePath()
  ctx.fill()

  text(ctx, 'PHOTO', cx, y + h - 26, '500 18px "JetBrains Mono", monospace', '#55555c', {
    align: 'center',
    tracking: 6,
  })
}

function photoCover(ctx: Ctx, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / img.width, h / img.height)
  const iw = img.width * s
  const ih = img.height * s
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih)
}

function cropMarks(ctx: Ctx, x: number, y: number, w: number, h: number) {
  const o = 12
  const l = 30
  ctx.strokeStyle = CRIMSON
  ctx.lineWidth = 4
  const corners: [number, number, number, number][] = [
    [x - o, y - o, 1, 1],
    [x + w + o, y - o, -1, 1],
    [x - o, y + h + o, 1, -1],
    [x + w + o, y + h + o, -1, -1],
  ]
  for (const [cx, cy, dx, dy] of corners) {
    ctx.beginPath()
    ctx.moveTo(cx, cy + dy * l)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx + dx * l, cy)
    ctx.stroke()
  }
}

function footer(ctx: Ctx, left: string, right: string) {
  const g = ctx.createLinearGradient(0, 0, CARD_W, 0)
  g.addColorStop(0, BLOOD)
  g.addColorStop(1, CRIMSON)
  ctx.fillStyle = g
  ctx.fillRect(0, CARD_H - 92, CARD_W, 92)
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.fillRect(0, CARD_H - 92, CARD_W, 3)
  text(ctx, left, 72, CARD_H - 36, '600 22px "JetBrains Mono", monospace', '#ffffff', { tracking: 5 })
  text(ctx, right, CARD_W - 72, CARD_H - 36, '600 22px "JetBrains Mono", monospace', 'rgba(255,255,255,0.8)', {
    align: 'right',
    tracking: 5,
  })
}

/* ───────────────────────── card faces ───────────────────────── */

function drawFront(ctx: Ctx, p: Profile, photo?: HTMLImageElement | null) {
  const c = p.card
  const MONO = '"JetBrains Mono", monospace'
  const DISPLAY = '"Space Grotesk", Inter, sans-serif'
  const SANS = 'Inter, sans-serif'

  background(ctx)

  // header
  ctx.fillStyle = 'rgba(5,5,6,0.65)'
  ctx.fillRect(0, 0, CARD_W, 252)
  ctx.fillStyle = '#26262b'
  ctx.fillRect(0, 252, CARD_W, 2)

  // monogram
  ctx.strokeStyle = '#3a3a40'
  ctx.lineWidth = 3
  roundRect(ctx, 72, 62, 100, 100, 12)
  ctx.stroke()
  text(ctx, p.initials, 122, 128, `700 44px ${DISPLAY}`, '#F4F4F5', { align: 'center' })
  ctx.fillStyle = CRIMSON
  ctx.fillRect(100, 144, 44, 5)

  ctx.font = fitFont(ctx, c.institution.toUpperCase(), 700, DISPLAY, 42, 740, 2)
  ctx.fillStyle = '#F4F4F5'
  spacing(ctx, 2)
  ctx.textAlign = 'left'
  ctx.fillText(c.institution.toUpperCase(), 200, 110)
  spacing(ctx, 0)
  text(ctx, c.department.toUpperCase(), 200, 150, `600 23px ${MONO}`, '#C4C4CC', { tracking: 3 })

  text(ctx, 'IDENTIFICATION CARD', 72, 222, `600 21px ${MONO}`, '#A1A1AA', { tracking: 6 })
  text(ctx, '● DEV ACCESS', CARD_W - 72, 222, `700 21px ${MONO}`, CRIMSON_LIGHT, {
    align: 'right',
    tracking: 5,
  })

  // red identification bar
  ctx.fillStyle = CRIMSON
  ctx.fillRect(0, 254, 14, 930)

  // photo
  const px = 72, py = 310, pw = 380, ph = 470
  ctx.save()
  roundRect(ctx, px, py, pw, ph, 14)
  ctx.clip()
  if (photo) photoCover(ctx, photo, px, py, pw, ph)
  else silhouette(ctx, px, py, pw, ph)
  ctx.restore()
  ctx.strokeStyle = '#2E2E33'
  ctx.lineWidth = 2
  roundRect(ctx, px, py, pw, ph, 14)
  ctx.stroke()
  cropMarks(ctx, px, py, pw, ph)

  // fields
  const fx = 506
  const label = (v: string, x: number, y: number) =>
    text(ctx, v, x, y, `600 21px ${MONO}`, '#A1A1AA', { tracking: 3 })
  label('ID NO.', fx, 336)
  text(ctx, c.idNumber, fx, 384, `700 44px ${MONO}`, '#FFFFFF', { tracking: 1 })
  label('PROGRAM', fx, 446)
  ctx.font = fitFont(ctx, c.program, 700, SANS, 34, 440)
  ctx.fillStyle = '#E4E4E7'
  ctx.fillText(c.program, fx, 486)
  label('ISSUED', fx, 552)
  text(ctx, c.issued, fx, 594, `700 32px ${MONO}`, '#FFFFFF')
  label('VALID THRU', fx + 236, 552)
  text(ctx, c.validThru, fx + 236, 594, `700 32px ${MONO}`, '#FFFFFF')

  // smart chip
  const chx = fx, chy = 650
  const cg = ctx.createLinearGradient(chx, chy, chx + 118, chy + 92)
  cg.addColorStop(0, '#b9b9bf')
  cg.addColorStop(0.5, '#7d7d84')
  cg.addColorStop(1, '#a3a3aa')
  ctx.fillStyle = cg
  roundRect(ctx, chx, chy, 118, 92, 14)
  ctx.fill()
  ctx.strokeStyle = 'rgba(20,20,22,0.55)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(chx + 40, chy); ctx.lineTo(chx + 40, chy + 92)
  ctx.moveTo(chx + 78, chy); ctx.lineTo(chx + 78, chy + 92)
  ctx.moveTo(chx, chy + 32); ctx.lineTo(chx + 40, chy + 32)
  ctx.moveTo(chx, chy + 60); ctx.lineTo(chx + 40, chy + 60)
  ctx.moveTo(chx + 78, chy + 32); ctx.lineTo(chx + 118, chy + 32)
  ctx.moveTo(chx + 78, chy + 60); ctx.lineTo(chx + 118, chy + 60)
  ctx.stroke()
  if (c.birthday) {
    label('DATE OF BIRTH', fx + 152, 686)
    text(ctx, c.birthday, fx + 152, 728, `700 32px ${MONO}`, '#FFFFFF', { tracking: 2 })
  } else {
    label('STATUS', fx + 152, 686)
    text(ctx, 'STUDENT', fx + 152, 728, `700 32px ${MONO}`, CRIMSON_LIGHT, { tracking: 2 })
  }

  // name
  const { first, last } = splitName(p.fullName.toUpperCase())
  ctx.textAlign = 'left'
  ctx.fillStyle = '#F7F7F8'
  ctx.font = fitFont(ctx, first, 700, DISPLAY, 88, 880, 1)
  spacing(ctx, 1)
  ctx.fillText(first, 72, 905)
  ctx.font = fitFont(ctx, last, 700, DISPLAY, 88, 880, 1)
  ctx.fillText(last, 72, 995)
  spacing(ctx, 0)

  text(ctx, p.role, 72, 1070, `600 37px ${SANS}`, '#F4F4F5')

  // divider
  ctx.fillStyle = '#26262b'
  ctx.fillRect(72, 1176, CARD_W - 144, 2)
  ctx.fillStyle = CRIMSON
  ctx.fillRect(72, 1176, 110, 2)

  // QR + signature + barcode
  qr(ctx, 84, 1232, 212, p.fullName + c.idNumber)
  const sx = 360
  label('CARDHOLDER SIGNATURE', sx, 1244)
  ctx.fillStyle = '#3a3a40'
  ctx.fillRect(sx, 1316, CARD_W - 72 - sx, 2)
  barcode(ctx, sx, 1346, CARD_W - 72 - sx, 70, c.idNumber)
  text(ctx, c.idNumber.replace(/-/g, ' '), sx, 1456, `700 26px ${MONO}`, '#D4D4D8', { tracking: 8 })

  footer(ctx, p.location.toUpperCase(), `${c.validThru.split('/').pop()?.trim() ?? ''}`)
}

function drawBack(ctx: Ctx, p: Profile) {
  const c = p.card
  const MONO = '"JetBrains Mono", monospace'
  const DISPLAY = '"Space Grotesk", Inter, sans-serif'

  background(ctx)

  // magnetic stripe
  ctx.fillStyle = '#030303'
  ctx.fillRect(0, 110, CARD_W, 150)
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  ctx.fillRect(0, 110, CARD_W, 3)

  // watermark monogram
  text(ctx, p.initials, CARD_W / 2, 1290, `700 520px ${DISPLAY}`, 'rgba(255,255,255,0.03)', { align: 'center' })

  text(ctx, 'PROPERTY OF', 72, 360, `600 21px ${MONO}`, '#A1A1AA', { tracking: 6 })
  ctx.font = fitFont(ctx, c.institution.toUpperCase(), 700, DISPLAY, 46, 880, 2)
  ctx.fillStyle = '#F4F4F5'
  spacing(ctx, 2)
  ctx.textAlign = 'left'
  ctx.fillText(c.institution.toUpperCase(), 72, 418)
  spacing(ctx, 0)
  text(ctx, c.department, 72, 462, `600 26px ${MONO}`, '#C4C4CC')

  ctx.fillStyle = CRIMSON
  ctx.fillRect(72, 510, 110, 4)

  ctx.font = '400 27px Inter, sans-serif'
  ctx.fillStyle = '#9A9AA2'
  ctx.textAlign = 'left'
  wrap(
    ctx,
    'This card identifies the holder as a student of the institution named above. It is non-transferable. If found, please return it to the issuing office or contact the cardholder.',
    72,
    580,
    CARD_W - 144,
    42,
  )

  const row = (k: string, v: string, y: number) => {
    text(ctx, k, 72, y, `600 21px ${MONO}`, '#A1A1AA', { tracking: 3 })
    ctx.font = fitFont(ctx, v, 500, MONO, 28, CARD_W - 144)
    ctx.fillStyle = '#E4E4E7'
    ctx.fillText(v, 72, y + 40)
  }
  row('EMAIL', p.email, 820)
  row('GITHUB', stripProtocol(p.socials.github), 920)
  row('LINKEDIN', stripProtocol(p.socials.linkedin), 1020)

  qr(ctx, CARD_W - 72 - 190, 1250, 190, p.socials.github)
  barcode(ctx, 72, 1270, 520, 64, c.idNumber + 'b')
  text(ctx, `NO. ${c.idNumber}`, 72, 1384, `700 26px ${MONO}`, '#D4D4D8', { tracking: 6 })

  footer(ctx, 'NON-TRANSFERABLE', c.idNumber)
}

/* ───────────────────────── public API ───────────────────────── */

function makeTexture(canvas: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 16
  t.generateMipmaps = true
  t.minFilter = THREE.LinearMipmapLinearFilter
  return t
}

export function createCardTextures(p: Profile) {
  const front = document.createElement('canvas')
  const back = document.createElement('canvas')
  front.width = back.width = CARD_W * RES
  front.height = back.height = CARD_H * RES
  const fctx = front.getContext('2d')!
  const bctx = back.getContext('2d')!

  const frontTex = makeTexture(front)
  const backTex = makeTexture(back)

  let photo: HTMLImageElement | null = null
  const redraw = () => {
    fctx.setTransform(RES, 0, 0, RES, 0, 0)
    bctx.setTransform(RES, 0, 0, RES, 0, 0)
    drawFront(fctx, p, photo)
    drawBack(bctx, p)
    frontTex.needsUpdate = true
    backTex.needsUpdate = true
  }
  redraw()

  // redraw once web fonts are ready so the canvas uses the real typefaces
  if (document.fonts) {
    Promise.all([
      document.fonts.load('700 40px "Space Grotesk"'),
      document.fonts.load('500 20px "JetBrains Mono"'),
      document.fonts.load('600 20px Inter'),
    ])
      .catch(() => undefined)
      .then(() => document.fonts.ready)
      .then(redraw)
  }

  if (p.photo) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      photo = img
      redraw()
    }
    img.src = p.photo
  }

  return { front: frontTex, back: backTex }
}

/** Woven black strap with stitched edges, red accent stripes and repeating embroidered text. */
function drawStrap(ctx: Ctx, w: number, h: number, label: string) {
  ctx.fillStyle = '#18181b'
  ctx.fillRect(0, 0, w, h)

  // weave: alternating diagonal threads
  const r = rng(42)
  for (let x = -h; x < w; x += 3) {
    ctx.strokeStyle = `rgba(255,255,255,${0.025 + r() * 0.05})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + h * 0.5, h)
    ctx.stroke()
  }
  for (let y = 0; y < h; y += 2) {
    ctx.fillStyle = `rgba(0,0,0,${0.15 + r() * 0.2})`
    ctx.fillRect(0, y, w, 1)
  }

  // bound edges
  ctx.fillStyle = '#151517'
  ctx.fillRect(0, 0, w, 12)
  ctx.fillRect(0, h - 12, w, 12)

  // stitching
  ctx.strokeStyle = 'rgba(200,200,205,0.22)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([9, 6])
  for (const y of [17, h - 17]) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // red accent stripes
  ctx.fillStyle = CRIMSON
  ctx.fillRect(0, 24, w, 3)
  ctx.fillRect(0, h - 27, w, 3)

  // embroidered text
  ctx.font = '600 34px "JetBrains Mono", monospace'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  spacing(ctx, 10)
  const unit = `${label}   ◆   `
  const uw = ctx.measureText(unit).width
  for (let x = 20; x < w; x += uw) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillText(unit, x + 1, h / 2 + 2)
    ctx.fillStyle = '#8E8E96'
    ctx.fillText(unit, x, h / 2)
  }
  spacing(ctx, 0)
}

export function createStrapTexture(label: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  drawStrap(ctx, canvas.width, canvas.height, label)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 8

  document.fonts
    ?.load('600 34px "JetBrains Mono"')
    .then(() => {
      drawStrap(ctx, canvas.width, canvas.height, label)
      tex.needsUpdate = true
    })
    .catch(() => undefined)
  return tex
}
