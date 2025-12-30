import { motion } from 'framer-motion'
import { useGameStore, usePlayerStore } from '@/stores'

export function HUD() {
  const health = usePlayerStore((state) => state.health)
  const maxHealth = usePlayerStore((state) => state.maxHealth)
  const ammo = usePlayerStore((state) => state.ammo)
  const maxAmmo = usePlayerStore((state) => state.maxAmmo)
  const isReloading = usePlayerStore((state) => state.isReloading)

  const score = useGameStore((state) => state.score)
  const currentWave = useGameStore((state) => state.currentWave)
  const enemiesRemaining = useGameStore((state) => state.enemiesRemaining)
  const killStreak = useGameStore((state) => state.killStreak)

  const healthPercent = (health / maxHealth) * 100
  const healthColor = healthPercent > 50 ? '#00FFFF' : healthPercent > 25 ? '#FF6B00' : '#FF0000'

  return (
    <div className="fixed inset-0 pointer-events-none p-6 font-mono">
      {/* Top bar - Score and Wave */}
      <div className="flex justify-between items-start">
        {/* Score */}
        <motion.div
          className="text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-sm text-gray-400 uppercase tracking-wider">Score</div>
          <motion.div
            key={score}
            className="text-4xl font-bold text-glow-cyan"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            style={{ color: '#00FFFF' }}
          >
            {score.toLocaleString()}
          </motion.div>
          {killStreak > 1 && (
            <motion.div
              key={killStreak}
              className="text-sm text-glow-magenta"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: '#FF00FF' }}
            >
              {killStreak}x STREAK!
            </motion.div>
          )}
        </motion.div>

        {/* Wave */}
        <motion.div
          className="text-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-sm text-gray-400 uppercase tracking-wider">Wave</div>
          <div className="text-4xl font-bold text-glow-magenta" style={{ color: '#FF00FF' }}>
            {currentWave}
          </div>
          <div className="text-sm text-gray-400">
            {enemiesRemaining} remaining
          </div>
        </motion.div>
      </div>

      {/* Bottom bar - Health and Ammo */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
        {/* Health */}
        <div className="w-64">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Health</div>
          <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: healthColor }}
              initial={{ width: '100%' }}
              animate={{ width: `${healthPercent}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          </div>
          <div className="text-sm mt-1" style={{ color: healthColor }}>
            {health} / {maxHealth}
          </div>
        </div>

        {/* Ammo */}
        <div className="text-right">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Ammo</div>
          {isReloading ? (
            <motion.div
              className="text-2xl text-glow-cyan"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              style={{ color: '#00FFFF' }}
            >
              RELOADING...
            </motion.div>
          ) : (
            <div className="text-2xl" style={{ color: ammo > 5 ? '#00FFFF' : '#FF6B00' }}>
              <span className="text-4xl font-bold">{ammo}</span>
              <span className="text-gray-400"> / {maxAmmo}</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">Press R to reload</div>
        </div>
      </div>
    </div>
  )
}
