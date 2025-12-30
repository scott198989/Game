import { motion } from 'framer-motion'
import { useGameStore } from '@/stores'

export function WaveAnnouncer() {
  const currentWave = useGameStore((state) => state.currentWave)

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-2xl text-gray-400 uppercase tracking-widest mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Wave Complete
      </motion.div>

      <motion.div
        className="text-8xl font-bold text-glow-magenta"
        style={{ color: '#FF00FF' }}
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        WAVE {currentWave + 1}
      </motion.div>

      <motion.div
        className="text-xl text-cyan-400 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        Get Ready...
      </motion.div>

      {/* Decorative lines */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        style={{ top: '40%' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-magenta-400 to-transparent"
        style={{ top: '60%', backgroundColor: '#FF00FF' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />
    </motion.div>
  )
}
