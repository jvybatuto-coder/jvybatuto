import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import * as THREE from 'three'

/** Strap width in world units (the metal crimp is 0.66 wide). */
export const STRAP_WIDTH = 0.52

export interface StrapHandle {
  /** Rebuild the ribbon along the given centre-line points (card end first). */
  update: (points: THREE.Vector3[]) => void
}

/**
 * A flat woven ribbon rebuilt every frame along the rope curve.
 * The ribbon stays oriented towards +Z (like a real lanyard lying flat
 * against the wearer), and it is lit with a fabric bump texture.
 */
export const Strap = forwardRef<StrapHandle, { texture: THREE.Texture; segments: number }>(function Strap(
  { texture, segments },
  ref,
) {
  const mesh = useRef<THREE.Mesh>(null)
  const n = segments + 1

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new THREE.BufferAttribute(new Float32Array(n * 2 * 3), 3).setUsage(THREE.DynamicDrawUsage)
    const nor = new THREE.BufferAttribute(new Float32Array(n * 2 * 3), 3).setUsage(THREE.DynamicDrawUsage)
    const uv = new Float32Array(n * 2 * 2)
    for (let i = 0; i < n; i++) {
      const u = i / segments
      uv.set([u, 1, u, 0], i * 4)
    }
    const index: number[] = []
    for (let i = 0; i < segments; i++) {
      const a = i * 2
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
    g.setAttribute('position', pos)
    g.setAttribute('normal', nor)
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    g.setIndex(index)
    return g
  }, [n, segments])

  const tmp = useMemo(
    () => ({ t: new THREE.Vector3(), s: new THREE.Vector3(), nrm: new THREE.Vector3(), fwd: new THREE.Vector3(0, 0, 1) }),
    [],
  )

  useImperativeHandle(
    ref,
    () => ({
      update(points) {
        const pos = geometry.attributes.position as THREE.BufferAttribute
        const nor = geometry.attributes.normal as THREE.BufferAttribute
        const half = STRAP_WIDTH / 2
        const { t, s, nrm, fwd } = tmp
        let length = 0
        for (let i = 0; i < n; i++) {
          const p = points[i]
          const a = points[Math.max(0, i - 1)]
          const b = points[Math.min(n - 1, i + 1)]
          t.subVectors(b, a)
          if (t.lengthSq() < 1e-10) t.set(0, 1, 0)
          t.normalize()
          s.crossVectors(t, fwd)
          if (s.lengthSq() < 1e-8) s.set(1, 0, 0)
          s.normalize()
          nrm.crossVectors(s, t).normalize()
          s.multiplyScalar(half)
          pos.setXYZ(i * 2, p.x - s.x, p.y - s.y, p.z - s.z)
          pos.setXYZ(i * 2 + 1, p.x + s.x, p.y + s.y, p.z + s.z)
          nor.setXYZ(i * 2, nrm.x, nrm.y, nrm.z)
          nor.setXYZ(i * 2 + 1, nrm.x, nrm.y, nrm.z)
          if (i > 0) length += p.distanceTo(points[i - 1])
        }
        pos.needsUpdate = true
        nor.needsUpdate = true
        // keep the woven pattern at a constant physical scale (texture is 16:1)
        texture.repeat.set(length / (STRAP_WIDTH * 16), 1)
      },
    }),
    [geometry, n, texture, tmp],
  )

  return (
    <mesh ref={mesh} geometry={geometry} frustumCulled={false}>
      <meshStandardMaterial
        map={texture}
        bumpMap={texture}
        bumpScale={0.6}
        roughness={0.82}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
})
