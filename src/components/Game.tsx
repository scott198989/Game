import { Suspense, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Scene } from './three/Scene'
import { Arena } from './three/Arena'
import { Player } from './three/Player'
import { EnemyManager } from './three/enemies/EnemyManager'
import { HitEffects } from './three/effects/HitEffects'
import { HUD } from './ui/HUD'
import { MainMenu } from './ui/MainMenu'
import { PauseMenu } from './ui/PauseMenu'
import { GameOver } from './ui/GameOver'
import { WaveAnnouncer } from './ui/WaveAnnouncer'
import { DamageOverlay } from './ui/DamageOverlay'
import { Crosshair } from './ui/Crosshair'
import { useGameStore, usePlayerStore, useEnemyStore, useUIStore } from '@/stores'

// Keyboard control mapping
export const Controls = {
  forward: 'forward',
  backward: 'backward',
  left: 'left',
  right: 'right',
  jump: 'jump',
  reload: 'reload',
} as const

export type Controls = typeof Controls[keyof typeof Controls]

const keyboardMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.jump, keys: ['Space'] },
  { name: Controls.reload, keys: ['KeyR'] },
]

export function Game() {
  const status = useGameStore((state) => state.status)
  const pauseGame = useGameStore((state) => state.pauseGame)
  const resumeGame = useGameStore((state) => state.resumeGame)

  // Handle escape key for pause
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      if (status === 'playing') {
        pauseGame()
      } else if (status === 'paused') {
        resumeGame()
      }
    }
  }, [status, pauseGame, resumeGame])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Reset stores when going back to menu
  const resetGame = useCallback(() => {
    useGameStore.getState().reset()
    usePlayerStore.getState().reset()
    useEnemyStore.getState().clearAllEnemies()
    useEnemyStore.getState().clearHitEffects()
    useUIStore.getState().reset()
  }, [])

  return (
    <div className="w-full h-full relative">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ fov: 75, near: 0.1, far: 1000 }}
          gl={{ antialias: true }}
          className={status === 'playing' ? 'pointer-locked' : ''}
        >
          <Suspense fallback={null}>
            <Scene />
            <Arena />

            {(status === 'playing' || status === 'paused' || status === 'wave-transition') && (
              <>
                <Player />
                <EnemyManager />
                <HitEffects />
              </>
            )}

            {/* Post-processing effects */}
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                intensity={1.5}
              />
              <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </KeyboardControls>

      {/* UI Overlays */}
      {status === 'menu' && <MainMenu />}
      {status === 'paused' && <PauseMenu onResume={resumeGame} onQuit={resetGame} />}
      {status === 'gameover' && <GameOver onRestart={resetGame} />}
      {status === 'wave-transition' && <WaveAnnouncer />}
      {(status === 'playing' || status === 'wave-transition') && (
        <>
          <HUD />
          <Crosshair />
          <DamageOverlay />
        </>
      )}
    </div>
  )
}
