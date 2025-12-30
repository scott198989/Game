import { create } from 'zustand'
import { SCREEN_SHAKE_DECAY } from '@/utils/constants'

interface UIState {
  // Screen shake
  shakeIntensity: number

  // Damage feedback
  damageFlashOpacity: number

  // Transitions
  isTransitioning: boolean
  transitionType: 'wave' | 'death' | 'start' | null

  // Crosshair
  showHitMarker: boolean

  // Actions
  triggerShake: (intensity: number) => void
  triggerDamageFlash: () => void
  triggerHitMarker: () => void
  startTransition: (type: 'wave' | 'death' | 'start') => void
  endTransition: () => void
  updateFrame: (delta: number) => void
  reset: () => void
}

const INITIAL_STATE = {
  shakeIntensity: 0,
  damageFlashOpacity: 0,
  isTransitioning: false,
  transitionType: null as 'wave' | 'death' | 'start' | null,
  showHitMarker: false,
}

export const useUIStore = create<UIState>((set, get) => ({
  ...INITIAL_STATE,

  triggerShake: (intensity: number) => set((state) => ({
    shakeIntensity: Math.max(state.shakeIntensity, intensity),
  })),

  triggerDamageFlash: () => {
    set({ damageFlashOpacity: 0.5 })
  },

  triggerHitMarker: () => {
    set({ showHitMarker: true })
    setTimeout(() => set({ showHitMarker: false }), 100)
  },

  startTransition: (type) => set({
    isTransitioning: true,
    transitionType: type,
  }),

  endTransition: () => set({
    isTransitioning: false,
    transitionType: null,
  }),

  updateFrame: (delta: number) => {
    const { shakeIntensity, damageFlashOpacity } = get()

    // Decay shake
    if (shakeIntensity > 0.001) {
      set({
        shakeIntensity: shakeIntensity * Math.pow(SCREEN_SHAKE_DECAY, delta * 60),
      })
    } else if (shakeIntensity !== 0) {
      set({ shakeIntensity: 0 })
    }

    // Decay damage flash
    if (damageFlashOpacity > 0.01) {
      set({
        damageFlashOpacity: damageFlashOpacity * Math.pow(0.9, delta * 60),
      })
    } else if (damageFlashOpacity !== 0) {
      set({ damageFlashOpacity: 0 })
    }
  },

  reset: () => set(INITIAL_STATE),
}))
