import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

export function Scene() {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    // Scene-level updates can go here
  })

  return (
    <group ref={groupRef}>
      {/* Ambient light for base visibility */}
      <ambientLight intensity={0.1} color="#4a0080" />

      {/* Main directional light */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={0.3}
        color="#00FFFF"
      />

      {/* Point lights for neon glow effect */}
      <pointLight position={[-15, 10, -15]} intensity={1} color="#FF00FF" distance={50} />
      <pointLight position={[15, 10, 15]} intensity={1} color="#00FFFF" distance={50} />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#39FF14" distance={40} />

      {/* Fog for depth */}
      <fog attach="fog" args={['#0A0A0F', 20, 80]} />
    </group>
  )
}
