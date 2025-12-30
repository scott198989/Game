import { motion } from 'framer-motion'

interface PauseMenuProps {
  onResume: () => void
  onQuit: () => void
}

export function PauseMenu({ onResume, onQuit }: PauseMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h2
        className="text-5xl font-bold mb-12 text-glow-cyan"
        style={{ color: '#00FFFF' }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        PAUSED
      </motion.h2>

      <motion.button
        className="px-10 py-3 text-xl font-bold uppercase tracking-wider mb-4
                   border-2 border-cyan-400 text-cyan-400
                   hover:bg-cyan-400 hover:text-black
                   transition-all duration-200"
        onClick={onResume}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Resume
      </motion.button>

      <motion.button
        className="px-10 py-3 text-xl font-bold uppercase tracking-wider
                   border-2 border-red-500 text-red-500
                   hover:bg-red-500 hover:text-black
                   transition-all duration-200"
        onClick={onQuit}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Quit to Menu
      </motion.button>

      <motion.p
        className="mt-8 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Press ESC to resume
      </motion.p>
    </motion.div>
  )
}
