import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { Mesh } from 'three'
import type { Enemy } from '@/types'
import { ENEMY_CONFIGS, PLAYER_RADIUS } from '@/utils/constants'
import { usePlayerStore, useEnemyStore } from '@/stores'

interface SphereEnemyProps {
  enemy: Enemy
  onCollision: (damage: number) => void
}

export function SphereEnemy({ enemy, onCollision }: SphereEnemyProps) {
  const meshRef = useRef<Mesh>(null)
  const config = ENEMY_CONFIGS.sphere
  const targetPos = useRef(new Vector3())
  const currentPos = useRef(new Vector3(...enemy.position))
  const timeRef = useRef(0)

  const playerPosition = usePlayerStore((state) => state.position)
  const updateBehaviorTimer = useEnemyStore((state) => state.updateEnemyBehaviorTimer)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    timeRef.current += delta

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

    // Zigzag movement - add perpendicular offset based on time
    const perpendicular = new Vector3(-direction.z, 0, direction.x)
    const zigzagOffset = Math.sin(timeRef.current * 5) * 0.8
    direction.add(perpendicular.multiplyScalar(zigzagOffset))
    direction.normalize()

    // Move toward player with zigzag
    const speed = enemy.speed * delta
    meshRef.current.position.x += direction.x * speed
    meshRef.current.position.z += direction.z * speed

    // Bob up and down
    meshRef.current.position.y = config.size + Math.sin(timeRef.current * 8) * 0.2

    // Update behavior timer
    updateBehaviorTimer(enemy.id, timeRef.current)

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
      <sphereGeometry args={[config.size, 16, 16]} />
      <meshStandardMaterial
        color={config.color}
        emissive={config.color}
        emissiveIntensity={glowIntensity}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  )
}
