import { motion } from 'framer-motion'
import { useUIStore, usePlayerStore } from '@/stores'

export function Crosshair() {
  const showHitMarker = useUIStore((state) => state.showHitMarker)
  const ammo = usePlayerStore((state) => state.ammo)
  const isReloading = usePlayerStore((state) => state.isReloading)

  const crosshairColor = isReloading ? '#FF6B00' : ammo > 0 ? '#00FFFF' : '#FF0000'

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      {/* Crosshair */}
      <div className="relative">
        {/* Horizontal lines */}
        <div
          className="absolute w-4 h-0.5 -left-6 top-1/2 -translate-y-1/2"
          style={{ backgroundColor: crosshairColor }}
        />
        <div
          className="absolute w-4 h-0.5 -right-6 top-1/2 -translate-y-1/2"
          style={{ backgroundColor: crosshairColor }}
        />

        {/* Vertical lines */}
        <div
          className="absolute h-4 w-0.5 left-1/2 -top-6 -translate-x-1/2"
          style={{ backgroundColor: crosshairColor }}
        />
        <div
          className="absolute h-4 w-0.5 left-1/2 -bottom-6 -translate-x-1/2"
          style={{ backgroundColor: crosshairColor }}
        />

        {/* Center dot */}
        <div
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: crosshairColor }}
        />

        {/* Hit marker */}
        {showHitMarker && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="relative">
              {/* Hit marker X */}
              <div
                className="absolute w-6 h-0.5 rotate-45 -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: '#FF0000', left: '50%', top: '50%' }}
              />
              <div
                className="absolute w-6 h-0.5 -rotate-45 -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: '#FF0000', left: '50%', top: '50%' }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
