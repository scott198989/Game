import { create } from 'zustand'
import type { GameStatus } from '@/types'

interface GameState {
  // Status
  status: GameStatus

  // Wave System
  currentWave: number
  enemiesRemaining: number
  enemiesSpawnedThisWave: number
  totalEnemiesThisWave: number

  // Scoring
  score: number
  highScore: number
  killStreak: number
  lastKillTime: number

  // Time
  gameTime: number

  // Actions
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  endGame: () => void
  startWaveTransition: () => void
  startNextWave: () => void
  setWaveEnemyCount: (total: number) => void
  enemySpawned: () => void
  enemyKilled: () => void
  addScore: (points: number) => void
  updateGameTime: (delta: number) => void
  reset: () => void
}

const INITIAL_STATE = {
  status: 'menu' as GameStatus,
  currentWave: 1,
  enemiesRemaining: 0,
  enemiesSpawnedThisWave: 0,
  totalEnemiesThisWave: 0,
  score: 0,
  highScore: 0,
  killStreak: 0,
  lastKillTime: 0,
  gameTime: 0,
}

export const useGameStore = create<GameState>((set, get) => ({
  ...INITIAL_STATE,

  startGame: () => set({
    status: 'playing',
    currentWave: 1,
    score: 0,
    gameTime: 0,
    enemiesRemaining: 0,
    enemiesSpawnedThisWave: 0,
    killStreak: 0,
  }),

  pauseGame: () => set({ status: 'paused' }),

  resumeGame: () => set({ status: 'playing' }),

  endGame: () => {
    const { score, highScore } = get()
    set({
      status: 'gameover',
      highScore: Math.max(score, highScore),
    })
  },

  startWaveTransition: () => set({ status: 'wave-transition' }),

  startNextWave: () => set((state) => ({
    status: 'playing',
    currentWave: state.currentWave + 1,
    enemiesSpawnedThisWave: 0,
    killStreak: 0,
  })),

  setWaveEnemyCount: (total: number) => set({
    totalEnemiesThisWave: total,
    enemiesRemaining: total,
  }),

  enemySpawned: () => set((state) => ({
    enemiesSpawnedThisWave: state.enemiesSpawnedThisWave + 1,
  })),

  enemyKilled: () => {
    const now = Date.now()
    const { lastKillTime, killStreak } = get()
    const timeSinceLastKill = now - lastKillTime

    // Kill streak continues if kills are within 2 seconds
    const newStreak = timeSinceLastKill < 2000 ? killStreak + 1 : 1

    set((state) => ({
      enemiesRemaining: state.enemiesRemaining - 1,
      killStreak: newStreak,
      lastKillTime: now,
    }))
  },

  addScore: (points: number) => {
    const { killStreak } = get()
    // Bonus for kill streaks
    const multiplier = Math.min(1 + (killStreak - 1) * 0.1, 2) // Max 2x
    const finalPoints = Math.floor(points * multiplier)

    set((state) => ({
      score: state.score + finalPoints,
    }))
  },

  updateGameTime: (delta: number) => set((state) => ({
    gameTime: state.gameTime + delta,
  })),

  reset: () => set(INITIAL_STATE),
}))
