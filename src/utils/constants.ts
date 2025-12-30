import type { EnemyConfig, EnemyType } from '@/types'

// Player constants
export const PLAYER_SPEED = 8
export const PLAYER_SPRINT_MULTIPLIER = 1.5
export const PLAYER_MAX_HEALTH = 100
export const PLAYER_MAX_AMMO = 30
export const PLAYER_RELOAD_TIME = 1500 // ms
export const PLAYER_RADIUS = 0.5
export const PLAYER_HEIGHT = 1.8

// Weapon constants
export const WEAPON_DAMAGE = 25
export const WEAPON_FIRE_RATE = 150 // ms between shots
export const WEAPON_RANGE = 100

// Arena constants
export const ARENA_SIZE = 40
export const ARENA_HALF_SIZE = ARENA_SIZE / 2

// Enemy configurations
export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  cube: {
    type: 'cube',
    health: 30,
    speed: 3,
    damage: 10,
    points: 100,
    color: '#FF00FF',
    emissiveIntensity: 2,
    size: 1,
    behavior: 'chase',
  },
  sphere: {
    type: 'sphere',
    health: 15,
    speed: 6,
    damage: 5,
    points: 75,
    color: '#00FFFF',
    emissiveIntensity: 2,
    size: 0.7,
    behavior: 'zigzag',
  },
  polyhedron: {
    type: 'polyhedron',
    health: 80,
    speed: 1.5,
    damage: 25,
    points: 250,
    color: '#39FF14',
    emissiveIntensity: 2.5,
    size: 1.5,
    behavior: 'slow-advance',
  },
}

// Wave constants
export const BASE_ENEMIES_PER_WAVE = 5
export const ENEMIES_PER_WAVE_INCREASE = 2.5
export const BASE_SPAWN_DELAY = 2 // seconds
export const MIN_SPAWN_DELAY = 0.5 // seconds
export const SPAWN_DELAY_DECREASE_PER_WAVE = 0.1
export const POLYHEDRON_SPAWN_WAVE = 3

// Visual constants
export const SCREEN_SHAKE_DECAY = 0.9
export const DAMAGE_FLASH_DURATION = 200 // ms
export const HIT_PARTICLE_LIFETIME = 500 // ms
export const DEATH_PARTICLE_LIFETIME = 800 // ms

// Colors
export const COLORS = {
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  green: '#39FF14',
  orange: '#FF6B00',
  dark: '#0A0A0F',
  darker: '#050508',
  white: '#FFFFFF',
  red: '#FF0000',
} as const
