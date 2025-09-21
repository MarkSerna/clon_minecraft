import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const Particles = ({ position, texture, count = 20, duration = 1000 }) => {
  const meshRef = useRef()
  const startTime = useRef(Date.now())
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Posición inicial cerca del bloque
      positions[i3] = position[0] + (Math.random() - 0.5) * 0.8
      positions[i3 + 1] = position[1] + (Math.random() - 0.5) * 0.8
      positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.8
      
      // Velocidades aleatorias
      velocities[i3] = (Math.random() - 0.5) * 4
      velocities[i3 + 1] = Math.random() * 3 + 1
      velocities[i3 + 2] = (Math.random() - 0.5) * 4
      
      // Escalas aleatorias
      scales[i] = Math.random() * 0.1 + 0.05
    }
    
    return { positions, velocities, scales }
  }, [position, count])
  
  useFrame(() => {
    if (!meshRef.current) return
    
    const elapsed = Date.now() - startTime.current
    const progress = Math.min(elapsed / duration, 1)
    
    if (progress >= 1) {
      meshRef.current.visible = false
      return
    }
    
    const positions = meshRef.current.geometry.attributes.position.array
    const { velocities } = particles
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Actualizar posiciones con gravedad
      positions[i3] += velocities[i3] * 0.016
      positions[i3 + 1] += velocities[i3 + 1] * 0.016 - 9.8 * 0.016 * progress
      positions[i3 + 2] += velocities[i3 + 2] * 0.016
      
      // Reducir velocidades (fricción)
      velocities[i3] *= 0.98
      velocities[i3 + 1] *= 0.98
      velocities[i3 + 2] *= 0.98
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.material.opacity = 1 - progress
  })
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        transparent
        opacity={1}
        color="#8B4513"
        sizeAttenuation={true}
      />
    </points>
  )
}