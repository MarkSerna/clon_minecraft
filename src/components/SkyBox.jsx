import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, BackSide } from 'three'
import { useDayNightCycle } from './Lighting'

export const SkyBox = () => {
  const meshRef = useRef()
  const materialRef = useRef()
  const timeOfDay = useDayNightCycle()
  
  useFrame(() => {
    if (materialRef.current) {
      // Calcular colores del cielo basados en el tiempo del día
      const sunAngle = (timeOfDay - 0.25) * Math.PI * 2
      const sunHeight = Math.sin(sunAngle) * 0.8 + 0.2
      
      let skyColor
      
      if (sunHeight > 0.8) {
        // Mediodía - azul cielo brillante
        skyColor = new Color(0.5, 0.7, 1.0)
      } else if (sunHeight > 0.5) {
        // Día normal - azul cielo
        skyColor = new Color(0.4, 0.6, 0.9)
      } else if (sunHeight > 0.2) {
        // Tarde - azul más oscuro
        const t = (sunHeight - 0.2) / 0.3
        skyColor = new Color(0.3 + t * 0.1, 0.4 + t * 0.2, 0.7 + t * 0.2)
      } else if (sunHeight > 0) {
        // Amanecer/atardecer - colores cálidos
        const t = sunHeight / 0.2
        skyColor = new Color(
          0.8 - t * 0.5,  // Rojo/naranja que se desvanece
          0.4 - t * 0.1,  // Verde que se desvanece
          0.2 + t * 0.5   // Azul que aumenta
        )
      } else {
        // Noche - azul muy oscuro con tinte púrpura
        skyColor = new Color(0.05, 0.05, 0.15)
      }
      
      materialRef.current.color = skyColor
      
      // Agregar efecto de niebla atmosférica
      materialRef.current.opacity = 0.9 + sunHeight * 0.1
    }
  })
  
  return (
    <mesh ref={meshRef} scale={[500, 500, 500]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial 
        ref={materialRef}
        side={BackSide}
        transparent
        opacity={0.95}
        color={0x87CEEB}
      />
    </mesh>
  )
}

// Componente para efectos de partículas atmosféricas (opcional)
export const AtmosphericEffects = () => {
  const timeOfDay = useDayNightCycle()
  const particlesRef = useRef()
  
  useFrame((state) => {
    if (particlesRef.current) {
      // Rotar lentamente las partículas
      particlesRef.current.rotation.y += 0.0001
      
      // Ajustar opacidad basada en el tiempo del día
      const sunAngle = (timeOfDay - 0.25) * Math.PI * 2
      const sunHeight = Math.sin(sunAngle) * 0.8 + 0.2
      
      const opacity = sunHeight > 0.3 ? 0.1 : 0.05
      particlesRef.current.material.opacity = opacity
    }
  })
  
  // Crear posiciones aleatorias para las partículas
  const particleCount = 200
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 200     // x
    positions[i + 1] = Math.random() * 100 + 20    // y
    positions[i + 2] = (Math.random() - 0.5) * 200 // z
  }
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color={0xffffff}
        transparent
        opacity={0.1}
        sizeAttenuation={true}
      />
    </points>
  )
}