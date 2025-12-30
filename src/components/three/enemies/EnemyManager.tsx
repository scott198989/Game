import { useEffect, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import type { EnemyType } from '@/types'
import { CubeEnemy } from './CubeEnemy'
import { SphereEnemy } from './SphereEnemy'
import { PolyhedronEnemy } from './PolyhedronEnemy'
import { useGameStore, usePlayerStore, useEnemyStore, useUIStore } from '@/stores'
import {
  ARENA_HALF_SIZE,
  BASE_ENEMIES_PER_WAVE,
  ENEMIES_PER_WAVE_INCREASE,
  BASE_SPAWN_DELAY,
  MIN_SPAWN_DELAY,
  SPAWN_DELAY_DECREASE_PER_WAVE,
  POLYHEDRON_SPAWN_WAVE,
} from '@/utils/constants'

export function EnemyManager() {
  const spawnTimerRef = useRef(0)
  const lastDamageTimeRef = useRef(0)
  const waveStartedRef = useRef(false)

  const status = useGameStore((state) => state.status)
  const currentWave = useGameStore((state) => state.currentWave)
  const enemiesRemaining = useGameStore((state) => state.enemiesRemaining)
  const enemiesSpawnedThisWave = useGameStore((state) => state.enemiesSpawnedThisWave)
  const totalEnemiesThisWave = useGameStore((state) => state.totalEnemiesThisWave)
  const setWaveEnemyCount = useGameStore((state) => state.setWaveEnemyCount)
  const enemySpawned = useGameStore((state) => state.enemySpawned)
  const startWaveTransition = useGameStore((state) => state.startWaveTransition)
  const startNextWave = useGameStore((state) => state.startNextWave)
  const endGame = useGameStore((state) => state.endGame)

  const health = usePlayerStore((state) => state.health)
  const takeDamage = usePlayerStore((state) => state.takeDamage)
  const setInvulnerable = usePlayerStore((state) => state.setInvulnerable)

  const enemies = useEnemyStore((state) => state.enemies)
  const spawnEnemy = useEnemyStore((state) => state.spawnEnemy)
  const clearAllEnemies = useEnemyStore((state) => state.clearAllEnemies)

  const triggerDamageFlash = useUIStore((state) => state.triggerDamageFlash)
  const triggerShake = useUIStore((state) => state.triggerShake)

  // Calculate wave configuration
  const getWaveConfig = useCallback((wave: number) => {
    const totalEnemies = Math.floor(BASE_ENEMIES_PER_WAVE + (wave - 1) * ENEMIES_PER_WAVE_INCREASE)
    const spawnDelay = Math.max(MIN_SPAWN_DELAY, BASE_SPAWN_DELAY - (wave - 1) * SPAWN_DELAY_DECREASE_PER_WAVE)

    return { totalEnemies, spawnDelay }
  }, [])

  // Get random enemy type based on wave
  const getRandomEnemyType = useCallback((wave: number): EnemyType => {
    const rand = Math.random()

    if (wave >= POLYHEDRON_SPAWN_WAVE) {
      // After wave 3: 50% cube, 35% sphere, 15% polyhedron
      if (rand < 0.5) return 'cube'
      if (rand < 0.85) return 'sphere'
      return 'polyhedron'
    } else {
      // Before wave 3: 60% cube, 40% sphere
      if (rand < 0.6) return 'cube'
      return 'sphere'
    }
  }, [])

  // Get random spawn position at arena edge
  const getSpawnPosition = useCallback((): [number, number, number] => {
    const edge = Math.floor(Math.random() * 4)
    const offset = (Math.random() - 0.5) * (ARENA_HALF_SIZE * 2 - 4)

    switch (edge) {
      case 0: // North
        return [offset, 0, -ARENA_HALF_SIZE + 2]
      case 1: // South
        return [offset, 0, ARENA_HALF_SIZE - 2]
      case 2: // East
        return [ARENA_HALF_SIZE - 2, 0, offset]
      case 3: // West
        return [-ARENA_HALF_SIZE + 2, 0, offset]
      default:
        return [0, 0, -ARENA_HALF_SIZE + 2]
    }
  }, [])

  // Initialize wave
  useEffect(() => {
    if (status === 'playing' && !waveStartedRef.current) {
      const config = getWaveConfig(currentWave)
      setWaveEnemyCount(config.totalEnemies)
      waveStartedRef.current = true
      spawnTimerRef.current = 0
    }
  }, [status, currentWave, getWaveConfig, setWaveEnemyCount])

  // Handle player collision with enemy
  const handleEnemyCollision = useCallback((damage: number) => {
    const now = Date.now()
    // Invulnerability frames - 500ms between damage
    if (now - lastDamageTimeRef.current < 500) return

    lastDamageTimeRef.current = now
    takeDamage(damage)
    triggerDamageFlash()
    triggerShake(0.3)

    // Brief invulnerability
    setInvulnerable(true)
    setTimeout(() => setInvulnerable(false), 500)
  }, [takeDamage, triggerDamageFlash, triggerShake, setInvulnerable])

  // Check for game over
  useEffect(() => {
    if (status === 'playing' && health <= 0) {
      endGame()
    }
  }, [health, status, endGame])

  // Check for wave completion
  useEffect(() => {
    if (status === 'playing' &&
        enemiesRemaining === 0 &&
        enemiesSpawnedThisWave === totalEnemiesThisWave &&
        totalEnemiesThisWave > 0) {
      // Wave complete!
      waveStartedRef.current = false
      clearAllEnemies()
      startWaveTransition()

      // Start next wave after delay
      setTimeout(() => {
        startNextWave()
      }, 2000)
    }
  }, [
    status, enemiesRemaining, enemiesSpawnedThisWave, totalEnemiesThisWave,
    clearAllEnemies, startWaveTransition, startNextWave
  ])

  // Spawning loop
  useFrame((_, delta) => {
    if (status !== 'playing') return
    if (enemiesSpawnedThisWave >= totalEnemiesThisWave) return

    const config = getWaveConfig(currentWave)
    spawnTimerRef.current += delta

    if (spawnTimerRef.current >= config.spawnDelay) {
      spawnTimerRef.current = 0

      const type = getRandomEnemyType(currentWave)
      const position = getSpawnPosition()
      spawnEnemy(type, position)
      enemySpawned()
    }
  })

  // Render enemies
  const enemyArray = Array.from(enemies.values())

  return (
    <group>
      {enemyArray.map((enemy) => {
        switch (enemy.type) {
          case 'cube':
            return (
              <CubeEnemy
                key={enemy.id}
                enemy={enemy}
                onCollision={handleEnemyCollision}
              />
            )
          case 'sphere':
            return (
              <SphereEnemy
                key={enemy.id}
                enemy={enemy}
                onCollision={handleEnemyCollision}
              />
            )
          case 'polyhedron':
            return (
              <PolyhedronEnemy
                key={enemy.id}
                enemy={enemy}
                onCollision={handleEnemyCollision}
              />
            )
          default:
            return null
        }
      })}
    </group>
  )
}
