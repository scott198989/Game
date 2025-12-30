import { create } from 'zustand'
import type { Vector3Tuple } from 'three'
import { PLAYER_MAX_HEALTH, PLAYER_MAX_AMMO, WEAPON_FIRE_RATE, PLAYER_RELOAD_TIME } from '@/utils/constants'

interface PlayerState {
  // Position & Movement
  position: Vector3Tuple
  velocity: Vector3Tuple

  // Stats
  health: number
  maxHealth: number

  // Weapon
  ammo: number
  maxAmmo: number
  isReloading: boolean
  lastShotTime: number
  reloadStartTime: number

  // State flags
  isInvulnerable: boolean

  // Actions
  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  canShoot: () => boolean
  shoot: () => boolean
  reload: () => void
  finishReload: () => void
  updatePosition: (pos: Vector3Tuple) => void
  setInvulnerable: (value: boolean) => void
  reset: () => void
}

const INITIAL_STATE = {
  position: [0, 1, 0] as Vector3Tuple,
  velocity: [0, 0, 0] as Vector3Tuple,
  health: PLAYER_MAX_HEALTH,
  maxHealth: PLAYER_MAX_HEALTH,
  ammo: PLAYER_MAX_AMMO,
  maxAmmo: PLAYER_MAX_AMMO,
  isReloading: false,
  lastShotTime: 0,
  reloadStartTime: 0,
  isInvulnerable: false,
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...INITIAL_STATE,

  takeDamage: (amount: number) => {
    const { isInvulnerable } = get()
    if (isInvulnerable) return

    set((state) => ({
      health: Math.max(0, state.health - amount),
    }))
  },

  heal: (amount: number) => set((state) => ({
    health: Math.min(state.maxHealth, state.health + amount),
  })),

  canShoot: () => {
    const { ammo, isReloading, lastShotTime } = get()
    const now = Date.now()
    return ammo > 0 && !isReloading && (now - lastShotTime) >= WEAPON_FIRE_RATE
  },

  shoot: () => {
    const state = get()
    if (!state.canShoot()) return false

    set({
      ammo: state.ammo - 1,
      lastShotTime: Date.now(),
    })
    return true
  },

  reload: () => {
    const { isReloading, ammo, maxAmmo } = get()
    if (isReloading || ammo === maxAmmo) return

    set({
      isReloading: true,
      reloadStartTime: Date.now(),
    })

    // Auto-finish reload after delay
    setTimeout(() => {
      get().finishReload()
    }, PLAYER_RELOAD_TIME)
  },

  finishReload: () => set({
    ammo: PLAYER_MAX_AMMO,
    isReloading: false,
    reloadStartTime: 0,
  }),

  updatePosition: (pos: Vector3Tuple) => set({ position: pos }),

  setInvulnerable: (value: boolean) => set({ isInvulnerable: value }),

  reset: () => set(INITIAL_STATE),
}))
