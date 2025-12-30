import { create } from 'zustand'
import type { Vector3Tuple } from 'three'
import type { Enemy, EnemyType, HitEffect } from '@/types'
import { ENEMY_CONFIGS } from '@/utils/constants'

interface EnemyState {
  enemies: Map<string, Enemy>
  hitEffects: HitEffect[]

  // Actions
  spawnEnemy: (type: EnemyType, position: Vector3Tuple) => string
  damageEnemy: (id: string, damage: number) => { killed: boolean; points: number }
  removeEnemy: (id: string) => void
  updateEnemyPosition: (id: string, position: Vector3Tuple) => void
  updateEnemyBehaviorTimer: (id: string, timer: number) => void
  getActiveEnemies: () => Enemy[]
  addHitEffect: (position: Vector3Tuple, color: string) => void
  removeHitEffect: (id: string) => void
  clearAllEnemies: () => void
  clearHitEffects: () => void
}

let enemyIdCounter = 0
let hitEffectIdCounter = 0

export const useEnemyStore = create<EnemyState>((set, get) => ({
  enemies: new Map(),
  hitEffects: [],

  spawnEnemy: (type: EnemyType, position: Vector3Tuple) => {
    const config = ENEMY_CONFIGS[type]
    const id = `enemy-${++enemyIdCounter}`

    const enemy: Enemy = {
      id,
      type,
      position,
      health: config.health,
      maxHealth: config.health,
      speed: config.speed,
      damage: config.damage,
      points: config.points,
      isActive: true,
      behavior: config.behavior,
      behaviorTimer: 0,
    }

    set((state) => {
      const newEnemies = new Map(state.enemies)
      newEnemies.set(id, enemy)
      return { enemies: newEnemies }
    })

    return id
  },

  damageEnemy: (id: string, damage: number) => {
    const { enemies } = get()
    const enemy = enemies.get(id)

    if (!enemy || !enemy.isActive) {
      return { killed: false, points: 0 }
    }

    const newHealth = enemy.health - damage
    const killed = newHealth <= 0

    set((state) => {
      const newEnemies = new Map(state.enemies)
      if (killed) {
        newEnemies.delete(id)
      } else {
        newEnemies.set(id, { ...enemy, health: newHealth })
      }
      return { enemies: newEnemies }
    })

    return { killed, points: killed ? enemy.points : 0 }
  },

  removeEnemy: (id: string) => set((state) => {
    const newEnemies = new Map(state.enemies)
    newEnemies.delete(id)
    return { enemies: newEnemies }
  }),

  updateEnemyPosition: (id: string, position: Vector3Tuple) => set((state) => {
    const enemy = state.enemies.get(id)
    if (!enemy) return state

    const newEnemies = new Map(state.enemies)
    newEnemies.set(id, { ...enemy, position })
    return { enemies: newEnemies }
  }),

  updateEnemyBehaviorTimer: (id: string, timer: number) => set((state) => {
    const enemy = state.enemies.get(id)
    if (!enemy) return state

    const newEnemies = new Map(state.enemies)
    newEnemies.set(id, { ...enemy, behaviorTimer: timer })
    return { enemies: newEnemies }
  }),

  getActiveEnemies: () => {
    const { enemies } = get()
    return Array.from(enemies.values()).filter((e) => e.isActive)
  },

  addHitEffect: (position: Vector3Tuple, color: string) => {
    const id = `hit-${++hitEffectIdCounter}`
    const effect: HitEffect = {
      id,
      position,
      color,
      createdAt: Date.now(),
    }

    set((state) => ({
      hitEffects: [...state.hitEffects, effect],
    }))
  },

  removeHitEffect: (id: string) => set((state) => ({
    hitEffects: state.hitEffects.filter((e) => e.id !== id),
  })),

  clearAllEnemies: () => set({ enemies: new Map() }),

  clearHitEffects: () => set({ hitEffects: [] }),
}))
