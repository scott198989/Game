import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { Mesh } from 'three'
import type { Enemy } from '@/types'
import { ENEMY_CONFIGS, PLAYER_RADIUS } from '@/utils/constants'
import { usePlayerStore } from '@/stores'

interface CubeEnemyProps {
  enemy: Enemy
  onCollision: (damage: number) => void
}

export function CubeEnemy({ enemy, onCollision }: CubeEnemyProps) {
  const meshRef = useRef<Mesh>(null)
  const config = ENEMY_CONFIGS.cube
  const targetPos = useRef(new Vector3())
  const currentPos = useRef(new Vector3(...enemy.position))

  const playerPosition = usePlayerStore((state) => state.position)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Get player position
    targetPos.current.set(...playerPosition)
    targetPos.current.y = config.size / 2 // Enemy height

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

    // Rotate to face player
    meshRef.current.rotation.y += delta * 2

    // Check collision with player
    const distToPlayer = currentPos.current.distanceTo(
      new Vector3(playerPosition[0], config.size / 2, playerPosition[2])
    )
    const collisionDist = config.size / 2 + PLAYER_RADIUS

    if (distToPlayer < collisionDist) {
      onCollision(enemy.damage)
    }
  })

  // Health-based glow intensity
  const healthPercent = enemy.health / enemy.maxHealth
  const glowIntensity = config.emissiveIntensity * (0.5 + healthPercent * 0.5)

  return (
    <mesh
      ref={meshRef}
      position={[enemy.position[0], config.size / 2, enemy.position[2]]}
      userData={{ isEnemy: true, enemyId: enemy.id }}
    >
      <boxGeometry args={[config.size, config.size, config.size]} />
      <meshStandardMaterial
        color={config.color}
        emissive={config.color}
        emissiveIntensity={glowIntensity}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}
