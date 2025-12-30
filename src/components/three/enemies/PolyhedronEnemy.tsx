import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { Mesh } from 'three'
import type { Enemy } from '@/types'
import { ENEMY_CONFIGS, PLAYER_RADIUS } from '@/utils/constants'
import { usePlayerStore, useEnemyStore } from '@/stores'

interface PolyhedronEnemyProps {
  enemy: Enemy
  onCollision: (damage: number) => void
}

export function PolyhedronEnemy({ enemy, onCollision }: PolyhedronEnemyProps) {
  const meshRef = useRef<Mesh>(null)
  const config = ENEMY_CONFIGS.polyhedron
  const targetPos = useRef(new Vector3())
  const currentPos = useRef(new Vector3(...enemy.position))
  const pauseTimerRef = useRef(0)
  const isPausedRef = useRef(false)

  const playerPosition = usePlayerStore((state) => state.position)
  const updateBehaviorTimer = useEnemyStore((state) => state.updateEnemyBehaviorTimer)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Slow-advance behavior: move for 2 seconds, pause for 0.5 seconds
    pauseTimerRef.current += delta

    if (!isPausedRef.current && pauseTimerRef.current > 2) {
      isPausedRef.current = true
      pauseTimerRef.current = 0
    } else if (isPausedRef.current && pauseTimerRef.current > 0.5) {
      isPausedRef.current = false
      pauseTimerRef.current = 0
    }

    // Rotate menacingly
    meshRef.current.rotation.x += delta * 0.5
    meshRef.current.rotation.y += delta * 1

    if (isPausedRef.current) {
      // Pulsate while paused
      const scale = 1 + Math.sin(pauseTimerRef.current * 10) * 0.05
      meshRef.current.scale.setScalar(scale)
      return
    }

    meshRef.current.scale.setScalar(1)

    // Get player position
    targetPos.current.set(...playerPosition)
    targetPos.current.y = config.size

    // Current position
    currentPos.current.set(
      meshRef.current.position.x,
      meshRef.current.position.y,
      meshRef.current.position.z
    )

    // Direction to player
    const direction = targetPos.current.clone().sub(currentPos.current).normalize()

    // Move toward player
    const speed = enemy.speed * delta
    meshRef.current.position.x += direction.x * speed
    meshRef.current.position.z += direction.z * speed

    // Update behavior timer
    updateBehaviorTimer(enemy.id, pauseTimerRef.current)

    // Check collision with player
    const distToPlayer = currentPos.current.distanceTo(
      new Vector3(playerPosition[0], config.size, playerPosition[2])
    )
    const collisionDist = config.size + PLAYER_RADIUS

    if (distToPlayer < collisionDist) {
      onCollision(enemy.damage)
    }
  })

  const healthPercent = enemy.health / enemy.maxHealth
  const glowIntensity = config.emissiveIntensity * (0.5 + healthPercent * 0.5)

  return (
    <mesh
      ref={meshRef}
      position={[enemy.position[0], config.size, enemy.position[2]]}
      userData={{ isEnemy: true, enemyId: enemy.id }}
    >
      <icosahedronGeometry args={[config.size, 0]} />
      <meshStandardMaterial
        color={config.color}
        emissive={config.color}
        emissiveIntensity={glowIntensity}
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  )
}
