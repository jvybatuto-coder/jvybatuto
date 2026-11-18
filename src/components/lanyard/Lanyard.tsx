import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier'
import { profile } from '../../data/profile'
import { createCardTextures, createStrapTexture } from './textures'
import { CLIP_Y, IdCard } from './IdCard'
import { Strap, type StrapHandle } from './Strap'

type Segment = RapierRigidBody & { lerped?: THREE.Vector3 }

interface Interaction {
  inside: boolean
  scroll: number
}

interface LanyardProps {
  reducedMotion?: boolean
  compact?: boolean
}

/**
 * Physics-simulated lanyard.
 * A fixed anchor + three rope-jointed segments form the strap; a spherical joint
 * attaches the card. Gravity, damping and joint constraints produce the swing;
 * the pointer can push the card (hover) or grab it (drag), and page scroll adds
 * a small inertial nudge.
 */
export default function Lanyard({ reducedMotion = false, compact = false }: LanyardProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const interaction = useRef<Interaction>({ inside: false, scroll: 0 })
  const [visible, setVisible] = useState(true)

  // pause rendering + physics while off-screen
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // scroll → inertial impulse
  useEffect(() => {
    if (reducedMotion) return
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      interaction.current.scroll += y - last
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reducedMotion])

  return (
    <div
      ref={wrapRef}
      className="h-full w-full"
      style={{ touchAction: 'pan-y' }}
      onPointerEnter={() => (interaction.current.inside = true)}
      onPointerLeave={() => (interaction.current.inside = false)}
      role="img"
      aria-label={`Interactive ID card for ${profile.fullName}, ${profile.role}. Drag the card to swing the lanyard.`}
    >
      <Canvas
        camera={{ position: [0, 0, 11.6], fov: 25 }}
        dpr={[1, compact ? 1.5 : 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        frameloop={visible ? 'always' : 'never'}
        style={{ touchAction: 'pan-y' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 8]} intensity={1.4} />
        <directionalLight position={[-6, 2, 4]} intensity={0.5} color="#ff3b52" />

        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} interpolate paused={!visible}>
          <Band reducedMotion={reducedMotion} compact={compact} interaction={interaction} />
        </Physics>

        <Environment resolution={256} background={false} blur={0.6}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={5} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
          <Lightformer intensity={4} color="#C8102E" position={[10, 0, 4]} rotation={[0, -Math.PI / 2, 0]} scale={[20, 6, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

function Band({
  reducedMotion,
  compact,
  interaction,
  maxSpeed = 50,
  minSpeed = 10,
}: {
  reducedMotion: boolean
  compact: boolean
  interaction: MutableRefObject<Interaction>
  maxSpeed?: number
  minSpeed?: number
}) {
  const strapRef = useRef<StrapHandle>(null)
  const segments = compact ? 24 : 40
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<Segment>(null!)
  const j2 = useRef<Segment>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)

  const tmp = useMemo(
    () => ({
      vec: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      ang: new THREE.Vector3(),
      rot: new THREE.Vector3(),
      pointer: new THREE.Vector3(),
      prevPointer: new THREE.Vector3(),
      pointerVel: new THREE.Vector3(),
      hasPrev: false,
    }),
    [],
  )

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
  )
  curve.curveType = 'chordal'

  const textures = useMemo(() => createCardTextures(profile), [])
  // strap print: short school name first (the part visible above the card), then the full name, repeated
  const strap = useMemo(() => createStrapTexture(`BIPSU   ◆   ${profile.card.institution.toUpperCase()}`), [])

  useEffect(
    () => () => {
      textures.front.dispose()
      textures.back.dispose()
      strap.dispose()
    },
    [textures, strap],
  )

  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: reducedMotion ? 6 : 2,
    linearDamping: reducedMotion ? 6 : 2,
  }

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, CLIP_Y, 0]])

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = dragged ? 'grabbing' : 'grab'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (!card.current || !fixed.current || !j1.current || !j2.current || !j3.current) return
    const dt = Math.min(delta, 1 / 20)
    const { vec, dir, ang, rot, pointer, prevPointer, pointerVel } = tmp

    // pointer → world position on the z = 0 plane
    vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
    dir.copy(vec).sub(state.camera.position).normalize()
    const t = -state.camera.position.z / dir.z
    pointer.copy(state.camera.position).addScaledVector(dir, t)

    if (dragged) {
      ;[card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp())
      card.current.setNextKinematicTranslation({
        x: pointer.x - dragged.x,
        y: pointer.y - dragged.y,
        z: pointer.z - dragged.z,
      })
    } else if (!reducedMotion && interaction.current.inside && tmp.hasPrev) {
      // hover push: moving the cursor across the card nudges it like a hand brushing past
      pointerVel.copy(pointer).sub(prevPointer).divideScalar(dt)
      const p = card.current.translation()
      const d = Math.hypot(pointer.x - p.x, pointer.y - p.y)
      const radius = 1.7
      const speed = pointerVel.length()
      if (d < radius && speed > 0.6) {
        const falloff = (1 - d / radius) ** 2
        const m = card.current.mass()
        const k = 0.018 * falloff
        card.current.applyImpulseAtPoint(
          {
            x: clamp(pointerVel.x * k, -0.35, 0.35) * m,
            y: clamp(pointerVel.y * k * 0.35, -0.15, 0.15) * m,
            z: clamp(speed * k * 0.15, 0, 0.12) * m,
          },
          { x: pointer.x, y: pointer.y, z: p.z },
          true,
        )
      }
    }
    prevPointer.copy(pointer)
    tmp.hasPrev = true

    // scroll inertia: anchor moves with the page, the card lags behind
    const s = interaction.current.scroll
    if (!dragged && Math.abs(s) > 0.5) {
      const m = card.current.mass()
      const dv = clamp(s * 0.012, -1.6, 1.6)
      card.current.applyImpulse({ x: dv * 0.35 * m, y: -dv * 0.5 * m, z: 0 }, true)
    }
    interaction.current.scroll = 0

    // smooth the rope segments to avoid jitter
    ;[j1, j2].forEach((ref) => {
      const seg = ref.current
      if (!seg.lerped) seg.lerped = new THREE.Vector3().copy(seg.translation())
      const dist = clamp(seg.lerped.distanceTo(seg.translation()), 0.1, 1)
      seg.lerped.lerp(seg.translation(), Math.min(1, dt * (minSpeed + dist * (maxSpeed - minSpeed))))
    })

    curve.points[0].copy(j3.current.translation())
    curve.points[1].copy(j2.current.lerped!)
    curve.points[2].copy(j1.current.lerped!)
    curve.points[3].copy(fixed.current.translation())
    strapRef.current?.update(curve.getPoints(segments))

    // gently turn the card back to face the viewer
    ang.copy(card.current.angvel() as THREE.Vector3)
    rot.copy(card.current.rotation() as unknown as THREE.Vector3)
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
  })

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    drag(new THREE.Vector3().copy(e.point).sub(tmp.vec.copy(card.current.translation() as THREE.Vector3)))
  }
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
    drag(false)
  }

  return (
    <>
      <group position={[0, 4.2, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.87, 1.37, 0.03]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <IdCard front={textures.front} back={textures.back} />
          </group>
        </RigidBody>
      </group>

      <Strap ref={strapRef} texture={strap} segments={segments} />
    </>
  )
}
