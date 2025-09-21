import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import { Color, PlaneGeometry, MeshPhongMaterial } from 'three'
import { useStore } from '../hooks/useStore'

// Componente principal de agua
export const Water = ({ position = [0, 0, 0], size = [10, 1, 10] }) => {
  const meshRef = useRef()
  const materialRef = useRef()
  
  // Física del agua
  const [ref] = useBox(() => ({
    position,
    args: size,
    type: 'Static',
    material: {
      friction: 0.1,
      restitution: 0.3
    }
  }))
  
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const time = state.clock.elapsedTime
      
      // Animación de ondas
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1
      
      // Efecto de transparencia dinámica
      const opacity = 0.7 + Math.sin(time * 2) * 0.1
      materialRef.current.opacity = opacity
      
      // Color dinámico del agua
      const hue = 0.6 + Math.sin(time * 0.3) * 0.1
      materialRef.current.color.setHSL(hue, 0.8, 0.4)
    }
  })
  
  return (
    <group ref={ref}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={size} />
        <meshPhongMaterial
          ref={materialRef}
          color={0x006994}
          transparent
          opacity={0.7}
          shininess={100}
          specular={0x111111}
        />
      </mesh>
    </group>
  )
}

// Sistema de fluidos para simular corrientes de agua
export const WaterFlow = ({ startPosition, endPosition, width = 2 }) => {
  const particlesRef = useRef()
  const flowSpeed = 2
  
  const particles = useMemo(() => {
    const particleCount = 50
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    
    // Calcular dirección del flujo
    const direction = [
      endPosition[0] - startPosition[0],
      endPosition[1] - startPosition[1],
      endPosition[2] - startPosition[2]
    ]
    const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2)
    const normalizedDirection = direction.map(d => d / length)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Posición inicial aleatoria a lo largo del ancho del río
      const progress = Math.random()
      const crossOffset = (Math.random() - 0.5) * width
      
      positions[i3] = startPosition[0] + direction[0] * progress + crossOffset * normalizedDirection[2]
      positions[i3 + 1] = startPosition[1] + direction[1] * progress + Math.random() * 0.5
      positions[i3 + 2] = startPosition[2] + direction[2] * progress - crossOffset * normalizedDirection[0]
      
      // Velocidad en dirección del flujo
      velocities[i3] = normalizedDirection[0] * flowSpeed
      velocities[i3 + 1] = normalizedDirection[1] * flowSpeed + (Math.random() - 0.5) * 0.5
      velocities[i3 + 2] = normalizedDirection[2] * flowSpeed
    }
    
    return { positions, velocities, direction: normalizedDirection, length }
  }, [startPosition, endPosition, width])
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < positions.length; i += 3) {
        // Mover partículas
        positions[i] += particles.velocities[i] * delta
        positions[i + 1] += particles.velocities[i + 1] * delta
        positions[i + 2] += particles.velocities[i + 2] * delta
        
        // Reiniciar partículas que llegaron al final
        const currentPos = [positions[i], positions[i + 1], positions[i + 2]]
        const distanceFromStart = Math.sqrt(
          (currentPos[0] - startPosition[0]) ** 2 +
          (currentPos[1] - startPosition[1]) ** 2 +
          (currentPos[2] - startPosition[2]) ** 2
        )
        
        if (distanceFromStart > particles.length) {
          const crossOffset = (Math.random() - 0.5) * width
          positions[i] = startPosition[0] + crossOffset * particles.direction[2]
          positions[i + 1] = startPosition[1] + Math.random() * 0.5
          positions[i + 2] = startPosition[2] - crossOffset * particles.direction[0]
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color={0x4FC3F7}
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Lago o cuerpo de agua estático
export const Lake = ({ position = [0, 0, 0], radius = 10 }) => {
  const meshRef = useRef()
  const materialRef = useRef()
  
  // Física del lago
  const [ref] = useBox(() => ({
    position: [position[0], position[1] - 0.5, position[2]],
    args: [radius * 2, 1, radius * 2],
    type: 'Static',
    material: {
      friction: 0.1,
      restitution: 0.2
    }
  }))
  
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const time = state.clock.elapsedTime
      
      // Ondas concéntricas
      const waveHeight = Math.sin(time * 1.5) * 0.05
      meshRef.current.position.y = position[1] + waveHeight
      
      // Efecto de reflexión
      const reflectionIntensity = 0.8 + Math.sin(time * 0.8) * 0.2
      materialRef.current.shininess = reflectionIntensity * 100
    }
  })
  
  return (
    <group ref={ref}>
      <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshPhongMaterial
          ref={materialRef}
          color={0x1976D2}
          transparent
          opacity={0.8}
          shininess={80}
          specular={0x222222}
        />
      </mesh>
    </group>
  )
}

// Cascada con efectos de partículas
export const Waterfall = ({ position = [0, 10, 0], height = 10, width = 2 }) => {
  const particlesRef = useRef()
  const splashRef = useRef()
  
  const particles = useMemo(() => {
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Posición inicial en la parte superior de la cascada
      positions[i3] = position[0] + (Math.random() - 0.5) * width
      positions[i3 + 1] = position[1] + Math.random() * 2
      positions[i3 + 2] = position[2] + (Math.random() - 0.5) * 0.5
      
      // Velocidad hacia abajo con algo de dispersión
      velocities[i3] = (Math.random() - 0.5) * 0.5
      velocities[i3 + 1] = -5 - Math.random() * 3
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.5
    }
    
    return { positions, velocities }
  }, [position, width])
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < positions.length; i += 3) {
        // Aplicar gravedad y movimiento
        particles.velocities[i + 1] -= 9.81 * delta
        
        positions[i] += particles.velocities[i] * delta
        positions[i + 1] += particles.velocities[i + 1] * delta
        positions[i + 2] += particles.velocities[i + 2] * delta
        
        // Reiniciar partículas que llegaron al suelo
        if (positions[i + 1] < position[1] - height) {
          positions[i] = position[0] + (Math.random() - 0.5) * width
          positions[i + 1] = position[1] + Math.random() * 2
          positions[i + 2] = position[2] + (Math.random() - 0.5) * 0.5
          
          particles.velocities[i] = (Math.random() - 0.5) * 0.5
          particles.velocities[i + 1] = -5 - Math.random() * 3
          particles.velocities[i + 2] = (Math.random() - 0.5) * 0.5
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <group>
      {/* Partículas de agua cayendo */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.4}
          color={0x81D4FA}
          transparent
          opacity={0.9}
          sizeAttenuation={true}
        />
      </points>
      
      {/* Base de la cascada */}
      <Lake 
        position={[position[0], position[1] - height, position[2]]} 
        radius={width * 1.5} 
      />
    </group>
  )
}

// Hook para gestionar sistemas de agua
export const useWaterSystem = () => {
  const { cubes, addCube, removeCube } = useStore()
  
  const createWaterSource = (position, type = 'lake') => {
    const waterCube = {
      key: `water-${Date.now()}`,
      pos: position,
      texture: 'water',
      type: type
    }
    addCube(waterCube)
  }
  
  const removeWaterSource = (key) => {
    removeCube(key)
  }
  
  const getWaterCubes = () => {
    return cubes.filter(cube => cube.texture === 'water')
  }
  
  return {
    createWaterSource,
    removeWaterSource,
    getWaterCubes
  }
}