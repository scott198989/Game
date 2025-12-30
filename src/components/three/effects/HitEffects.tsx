import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color } from 'three'
import { useEnemyStore } from '@/stores'
import { HIT_PARTICLE_LIFETIME } from '@/utils/constants'

const PARTICLES_PER_HIT = 8
const MAX_PARTICLES = 200

export function HitEffects() {
  const meshRef = useRef<InstancedMesh>(null)
  const hitEffects = useEnemyStore((state) => state.hitEffects)
  const removeHitEffect = useEnemyStore((state) => state.removeHitEffect)

  const dummy = useMemo(() => new Object3D(), [])
  const particleData = useRef<Array<{
    id: string
    index: number
    position: [number, number, number]
    velocity: [number, number, number]
    life: number
    color: Color
  }>>([])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    const now = Date.now()

    // Create new particles from hit effects
    hitEffects.forEach((effect) => {
      const age = now - effect.createdAt

      if (age < 50 && particleData.current.filter(p => p.id === effect.id).length === 0) {
        // Spawn particles for this hit
        for (let i = 0; i < PARTICLES_PER_HIT; i++) {
          if (particleData.current.length >= MAX_PARTICLES) {
            particleData.current.shift() // Remove oldest
          }

          const angle = (i / PARTICLES_PER_HIT) * Math.PI * 2
          const speed = 2 + Math.random() * 3

          particleData.current.push({
            id: effect.id,
            index: particleData.current.length,
            position: [...effect.position] as [number, number, number],
            velocity: [
              Math.cos(angle) * speed,
              1 + Math.random() * 2,
              Math.sin(angle) * speed,
            ],
            life: 1,
            color: new Color(effect.color),
          })
        }
      }

      // Remove old effects
      if (age > HIT_PARTICLE_LIFETIME) {
        removeHitEffect(effect.id)
      }
    })

    // Update and render particles
    particleData.current = particleData.current.filter((particle, i) => {
      particle.life -= delta * 2
      if (particle.life <= 0) return false

      // Update position
      particle.position[0] += particle.velocity[0] * delta
      particle.position[1] += particle.velocity[1] * delta
      particle.position[2] += particle.velocity[2] * delta

      // Gravity
      particle.velocity[1] -= 9.8 * delta

      // Update instance
      dummy.position.set(...particle.position)
      dummy.scale.setScalar(particle.life * 0.15)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, particle.color)

      return true
    })

    // Clear remaining instances
    for (let i = particleData.current.length; i < MAX_PARTICLES; i++) {
      dummy.position.set(0, -100, 0)
      dummy.scale.setScalar(0)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PARTICLES]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        emissive="#FFFFFF"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </instancedMesh>
  )
}
