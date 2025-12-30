import { useRef } from 'react'
import { DoubleSide } from 'three'
import type { Mesh } from 'three'
import { ARENA_SIZE, ARENA_HALF_SIZE } from '@/utils/constants'

export function Arena() {
  const floorRef = useRef<Mesh>(null)

  return (
    <group>
      {/* Floor */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ARENA_SIZE, ARENA_SIZE, 40, 40]} />
        <meshStandardMaterial
          color="#0A0A0F"
          emissive="#1a0030"
          emissiveIntensity={0.2}
          wireframe={false}
          side={DoubleSide}
        />
      </mesh>

      {/* Grid lines on floor */}
      <gridHelper
        args={[ARENA_SIZE, 40, '#FF00FF', '#330033']}
        position={[0, 0.01, 0]}
      />

      {/* Boundary walls (invisible but for visual reference, we'll add glowing edges) */}
      {/* North wall */}
      <mesh position={[0, 2, -ARENA_HALF_SIZE]}>
        <boxGeometry args={[ARENA_SIZE, 4, 0.1]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#FF00FF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* South wall */}
      <mesh position={[0, 2, ARENA_HALF_SIZE]}>
        <boxGeometry args={[ARENA_SIZE, 4, 0.1]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#FF00FF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* East wall */}
      <mesh position={[ARENA_HALF_SIZE, 2, 0]}>
        <boxGeometry args={[0.1, 4, ARENA_SIZE]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#00FFFF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* West wall */}
      <mesh position={[-ARENA_HALF_SIZE, 2, 0]}>
        <boxGeometry args={[0.1, 4, ARENA_SIZE]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#00FFFF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Corner pillars for visual reference */}
      {[
        [-ARENA_HALF_SIZE, ARENA_HALF_SIZE],
        [ARENA_HALF_SIZE, ARENA_HALF_SIZE],
        [-ARENA_HALF_SIZE, -ARENA_HALF_SIZE],
        [ARENA_HALF_SIZE, -ARENA_HALF_SIZE],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 3, z]}>
          <boxGeometry args={[0.5, 6, 0.5]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#39FF14"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  )
}
