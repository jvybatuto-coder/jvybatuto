import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

/** Dimensions in world units (portrait CR80-like ratio). */
export const CARD = { w: 1.6, h: 2.5, t: 0.014 }
/** Local Y of the point where the strap's metal crimp attaches. */
export const CLIP_Y = 1.74

interface Props {
  front: THREE.Texture
  back: THREE.Texture
}

/**
 * The physical ID card: printed card, clear plastic holder with a punched
 * slot, split ring, swivel and a metal strap crimp.
 */
export function IdCard({ front, back }: Props) {
  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: '#dcdce0', roughness: 0.55 })
    const face = (map: THREE.Texture) =>
      // Half lit, half self-illuminated: keeps the print's true contrast
      // (dark card, bright text, natural photo) while still reacting to light.
      new THREE.MeshPhysicalMaterial({
        map,
        color: new THREE.Color(0.5, 0.5, 0.5),
        emissiveMap: map,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0.62,
        roughness: 0.6,
        envMapIntensity: 0.35,
        clearcoat: 0.15,
        clearcoatRoughness: 0.5,
      })
    // BoxGeometry face order: +x, -x, +y, -y, +z (front), -z (back)
    return [edge, edge, edge, edge, face(front), face(back)]
  }, [front, back])

  return (
    <group>
      {/* printed card */}
      <mesh material={materials} castShadow>
        <boxGeometry args={[CARD.w, CARD.h, CARD.t]} />
      </mesh>

      {/* punched slot (seen through the plastic) */}
      <RoundedBox args={[0.44, 0.075, 0.054]} radius={0.035} smoothness={3} position={[0, 1.335, 0]}>
        <meshStandardMaterial color="#030303" roughness={0.9} />
      </RoundedBox>

      {/* clear plastic holder */}
      <RoundedBox args={[1.74, 2.74, 0.05]} radius={0.05} smoothness={4} position={[0, 0.07, 0]} renderOrder={2}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          roughness={0.06}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={1.6}
          depthWrite={false}
        />
      </RoundedBox>

      {/* hardware */}
      <Hardware />
    </group>
  )
}

function Hardware() {
  return (
    <group>
      {/* split ring passing through the slot */}
      <mesh position={[0, 1.39, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.085, 0.016, 12, 40]} />
        <meshStandardMaterial color="#d6d6da" metalness={1} roughness={0.22} />
      </mesh>

      {/* swivel barrel */}
      <mesh position={[0, 1.535, 0]}>
        <cylinderGeometry args={[0.034, 0.03, 0.12, 20]} />
        <meshStandardMaterial color="#c8c8cc" metalness={1} roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.036, 16, 16]} />
        <meshStandardMaterial color="#c8c8cc" metalness={1} roughness={0.28} />
      </mesh>

      {/* upper loop */}
      <mesh position={[0, 1.655, 0]}>
        <torusGeometry args={[0.042, 0.012, 10, 28]} />
        <meshStandardMaterial color="#d6d6da" metalness={1} roughness={0.22} />
      </mesh>

      {/* strap crimp */}
      <RoundedBox args={[0.66, 0.13, 0.05]} radius={0.018} smoothness={3} position={[0, CLIP_Y, 0]}>
        <meshStandardMaterial color="#2c2c30" metalness={0.92} roughness={0.32} />
      </RoundedBox>
      <mesh position={[0, CLIP_Y, 0.026]}>
        <planeGeometry args={[0.5, 0.012]} />
        <meshStandardMaterial color="#C8102E" emissive="#C8102E" emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}
