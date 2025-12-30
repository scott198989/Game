import { motion } from 'framer-motion'
import { useGameStore } from '@/stores'

interface GameOverProps {
  onRestart: () => void
}

export function GameOver({ onRestart }: GameOverProps) {
  const score = useGameStore((state) => state.score)
  const highScore = useGameStore((state) => state.highScore)
  const currentWave = useGameStore((state) => state.currentWave)

  const isNewHighScore = score >= highScore && score > 0

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      <motion.h2
        className="text-6xl font-bold mb-8 text-glow-magenta"
        style={{ color: '#FF0000' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        GAME OVER
      </motion.h2>

      {isNewHighScore && (
        <motion.div
          className="text-2xl mb-4 text-glow-green"
          style={{ color: '#39FF14' }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.3 }}
        >
          NEW HIGH SCORE!
        </motion.div>
      )}

      <motion.div
        className="text-center mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="text-gray-400 text-lg">Final Score</div>
        <div
          className="text-5xl font-bold text-glow-cyan"
          style={{ color: '#00FFFF' }}
        >
          {score.toLocaleString()}
        </div>
        <div className="text-gray-500 mt-4">
          Reached Wave {currentWave}
        </div>
      </motion.div>

      <motion.button
        className="px-12 py-4 text-2xl font-bold uppercase tracking-wider
                   border-2 border-cyan-400 text-cyan-400
                   hover:bg-cyan-400 hover:text-black
                   transition-all duration-200 box-glow-cyan"
        onClick={onRestart}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Play Again
      </motion.button>

      <motion.p
        className="mt-6 text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        High Score: {highScore.toLocaleString()}
      </motion.p>
    </motion.div>
  )
}
