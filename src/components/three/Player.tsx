import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import { Vector3, Raycaster, Vector2 } from 'three'
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib'
import { damp } from 'maath/easing'
import { Controls } from '../Game'
import { useGameStore, usePlayerStore, useEnemyStore, useUIStore } from '@/stores'
import {
  PLAYER_SPEED,
  PLAYER_HEIGHT,
  ARENA_HALF_SIZE,
  WEAPON_DAMAGE,
  ENEMY_CONFIGS,
} from '@/utils/constants'

export function Player() {
  const controlsRef = useRef<PointerLockControlsImpl>(null)
  const velocityRef = useRef(new Vector3())
  const directionRef = useRef(new Vector3())
  const raycasterRef = useRef(new Raycaster())

  const { camera, scene } = useThree()

  const status = useGameStore((state) => state.status)
  const pauseGame = useGameStore((state) => state.pauseGame)
  const addScore = useGameStore((state) => state.addScore)
  const enemyKilled = useGameStore((state) => state.enemyKilled)

  const canShoot = usePlayerStore((state) => state.canShoot)
  const shoot = usePlayerStore((state) => state.shoot)
  const reload = usePlayerStore((state) => state.reload)
  const updatePosition = usePlayerStore((state) => state.updatePosition)

  const enemies = useEnemyStore((state) => state.enemies)
  const damageEnemy = useEnemyStore((state) => state.damageEnemy)
  const addHitEffect = useEnemyStore((state) => state.addHitEffect)

  const triggerShake = useUIStore((state) => state.triggerShake)
  const triggerHitMarker = useUIStore((state) => state.triggerHitMarker)
  const updateUIFrame = useUIStore((state) => state.updateFrame)

  const [, getKeys] = useKeyboardControls<Controls>()

  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, PLAYER_HEIGHT, 0)
  }, [camera])

  // Handle pointer lock
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    if (status === 'playing') {
      controls.lock()
    } else {
      controls.unlock()
    }
  }, [status])

  // Handle pointer lock change (when user presses ESC)
  useEffect(() => {
    const handleLockChange = () => {
      if (!document.pointerLockElement && status === 'playing') {
        pauseGame()
      }
    }

    document.addEventListener('pointerlockchange', handleLockChange)
    return () => document.removeEventListener('pointerlockchange', handleLockChange)
  }, [status, pauseGame])

  // Shooting handler
  const handleShoot = useCallback(() => {
    if (status !== 'playing') return
    if (!canShoot()) return
    if (!shoot()) return

    // Raycast from camera center
    raycasterRef.current.setFromCamera(new Vector2(0, 0), camera)

    // Find enemy meshes in scene
    const enemyMeshes = scene.children.filter(
      (obj) => obj.userData.isEnemy === true
    )

    const intersects = raycasterRef.current.intersectObjects(enemyMeshes, true)

    if (intersects.length > 0) {
      const hit = intersects[0]
      let enemyId = hit.object.userData.enemyId as string | undefined

      // Check parent if not found on object
      if (!enemyId && hit.object.parent) {
        enemyId = hit.object.parent.userData.enemyId as string | undefined
      }

      if (enemyId) {
        const enemy = enemies.get(enemyId)
        if (enemy) {
          const result = damageEnemy(enemyId, WEAPON_DAMAGE)
          const config = ENEMY_CONFIGS[enemy.type]

          // Add hit effect
          addHitEffect(
            [hit.point.x, hit.point.y, hit.point.z],
            config.color
          )

          // Hit feedback
          triggerHitMarker()

          if (result.killed) {
            addScore(result.points)
            enemyKilled()
            triggerShake(0.15)
          } else {
            triggerShake(0.05)
          }
        }
      }
    }
  }, [
    status, canShoot, shoot, camera, scene, enemies, damageEnemy,
    addHitEffect, triggerHitMarker, addScore, enemyKilled, triggerShake
  ])

  // Mouse click for shooting
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        handleShoot()
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    return () => window.removeEventListener('mousedown', handleMouseDown)
  }, [handleShoot])

  // Game loop
  useFrame((_, delta) => {
    if (status !== 'playing') return

    const { forward, backward, left, right, reload: reloadKey } = getKeys()

    // Handle reload
    if (reloadKey) {
      reload()
    }

    // Calculate movement direction
    directionRef.current.set(0, 0, 0)

    if (forward) directionRef.current.z -= 1
    if (backward) directionRef.current.z += 1
    if (left) directionRef.current.x -= 1
    if (right) directionRef.current.x += 1

    directionRef.current.normalize()

    // Apply camera rotation to movement direction
    directionRef.current.applyQuaternion(camera.quaternion)
    directionRef.current.y = 0 // Keep movement on XZ plane
    directionRef.current.normalize()

    // Target velocity
    const targetVelocity = directionRef.current.multiplyScalar(PLAYER_SPEED)

    // Smooth velocity
    damp(velocityRef.current, 'x', targetVelocity.x, 0.1, delta)
    damp(velocityRef.current, 'z', targetVelocity.z, 0.1, delta)

    // Apply velocity to position
    const newX = camera.position.x + velocityRef.current.x * delta
    const newZ = camera.position.z + velocityRef.current.z * delta

    // Clamp to arena bounds
    const boundedX = Math.max(-ARENA_HALF_SIZE + 1, Math.min(ARENA_HALF_SIZE - 1, newX))
    const boundedZ = Math.max(-ARENA_HALF_SIZE + 1, Math.min(ARENA_HALF_SIZE - 1, newZ))

    camera.position.x = boundedX
    camera.position.z = boundedZ

    // Update player store position
    updatePosition([camera.position.x, camera.position.y, camera.position.z])

    // Update UI effects
    updateUIFrame(delta)

    // Apply screen shake
    const shakeIntensity = useUIStore.getState().shakeIntensity
    if (shakeIntensity > 0.001) {
      camera.position.x += (Math.random() - 0.5) * shakeIntensity
      camera.position.y += (Math.random() - 0.5) * shakeIntensity * 0.5 + PLAYER_HEIGHT
      camera.position.z += (Math.random() - 0.5) * shakeIntensity
    }
  })

  return (
    <PointerLockControls
      ref={controlsRef}
      makeDefault
    />
  )
}
