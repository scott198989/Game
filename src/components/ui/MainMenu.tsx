import { motion } from 'framer-motion'
import { useGameStore } from '@/stores'

export function MainMenu() {
  const startGame = useGameStore((state) => state.startGame)
  const highScore = useGameStore((state) => state.highScore)

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-cyber-darker/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Title */}
      <motion.h1
        className="text-6xl md:text-8xl font-bold mb-4 text-glow-cyan tracking-widest"
        style={{ color: '#00FFFF' }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        NEON
      </motion.h1>
      <motion.h2
        className="text-4xl md:text-6xl font-bold mb-12 text-glow-magenta tracking-wider"
        style={{ color: '#FF00FF' }}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        SURVIVAL
      </motion.h2>

      {/* High Score */}
      {highScore > 0 && (
        <motion.div
          className="text-xl mb-8 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          High Score: <span className="text-glow-green" style={{ color: '#39FF14' }}>{highScore.toLocaleString()}</span>
        </motion.div>
      )}

      {/* Start Button */}
      <motion.button
        className="px-12 py-4 text-2xl font-bold uppercase tracking-wider
                   border-2 border-cyan-400 text-cyan-400
                   hover:bg-cyan-400 hover:text-black
                   transition-all duration-200 box-glow-cyan"
        onClick={startGame}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Click to Play
      </motion.button>

      {/* Controls */}
      <motion.div
        className="mt-12 text-gray-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="mb-2">WASD - Move | Mouse - Aim</p>
        <p className="mb-2">Left Click - Shoot | R - Reload</p>
        <p>ESC - Pause</p>
      </motion.div>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-cyan-400/50" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-magenta-400/50" style={{ borderColor: '#FF00FF50' }} />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-magenta-400/50" style={{ borderColor: '#FF00FF50' }} />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-cyan-400/50" />
    </motion.div>
  )
}
