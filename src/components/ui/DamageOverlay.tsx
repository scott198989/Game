import { useUIStore } from '@/stores'

export function DamageOverlay() {
  const damageFlashOpacity = useUIStore((state) => state.damageFlashOpacity)

  if (damageFlashOpacity < 0.01) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(circle at center, transparent 30%, rgba(255, 0, 0, ${damageFlashOpacity}) 100%)`,
      }}
    />
  )
}
