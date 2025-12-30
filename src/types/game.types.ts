import type { Vector3Tuple } from 'three'

export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover' | 'wave-transition'

export type EnemyType = 'cube' | 'sphere' | 'polyhedron'

export type EnemyBehavior = 'chase' | 'zigzag' | 'slow-advance'

export interface EnemyConfig {
  type: EnemyType
  health: number
  speed: number
  damage: number
  points: number
  color: string
  emissiveIntensity: number
  size: number
  behavior: EnemyBehavior
}

export interface Enemy {
  id: string
  type: EnemyType
  position: Vector3Tuple
  health: number
  maxHealth: number
  speed: number
  damage: number
  points: number
  isActive: boolean
  behavior: EnemyBehavior
  behaviorTimer: number
}

export interface WaveConfig {
  totalEnemies: number
  spawnDelay: number
  enemyHealthMultiplier: number
  enemySpeedMultiplier: number
  enemyTypeWeights: Record<EnemyType, number>
}

export interface ProjectileData {
  id: string
  origin: Vector3Tuple
  direction: Vector3Tuple
  createdAt: number
}

export interface ParticleData {
  id: string
  position: Vector3Tuple
  velocity: Vector3Tuple
  color: string
  life: number
  maxLife: number
}

export interface HitEffect {
  id: string
  position: Vector3Tuple
  color: string
  createdAt: number
}
