import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { DirectionalLight, Vector3 } from 'three'

export const Lighting = ({ timeOfDay = 0.5 }) => {
  const directionalLightRef = useRef()
  const shadowCameraRef = useRef()
  
  // Configurar iluminación basada en la hora del día
  useFrame(() => {
    if (directionalLightRef.current) {
      // Calcular posición del sol basada en la hora del día (0 = medianoche, 0.5 = mediodía, 1 = medianoche)
      const sunAngle = (timeOfDay - 0.5) * Math.PI
      const sunHeight = Math.sin(sunAngle * 0.5) * 50 + 20
      const sunDistance = Math.cos(sunAngle * 0.5) * 100
      
      // Posición del sol
      directionalLightRef.current.position.set(
        sunDistance,
        sunHeight,
        sunDistance * 0.5
      )
      
      // Intensidad basada en la hora del día
      let intensity = 1
      if (timeOfDay < 0.2 || timeOfDay > 0.8) {
        // Noche
        intensity = 0.1
      } else if (timeOfDay < 0.3 || timeOfDay > 0.7) {
        // Amanecer/Atardecer
        intensity = 0.4
      } else {
        // Día
        intensity = 1
      }
      
      directionalLightRef.current.intensity = intensity
      
      // Color de la luz basado en la hora del día
      if (timeOfDay < 0.2 || timeOfDay > 0.8) {
        // Noche - luz azulada
        directionalLightRef.current.color.setHex(0x4a5568)
      } else if (timeOfDay < 0.3 || timeOfDay > 0.7) {
        // Amanecer/Atardecer - luz naranja
        directionalLightRef.current.color.setHex(0xffa500)
      } else {
        // Día - luz blanca
        directionalLightRef.current.color.setHex(0xffffff)
      }
      
      // Actualizar target de la luz para que apunte al centro del mundo
      directionalLightRef.current.target.position.set(0, 0, 0)
      directionalLightRef.current.target.updateMatrixWorld()
    }
  })
  
  return (
    <group name="lighting-system">
      {/* Luz direccional principal (sol) */}
      <directionalLight
        ref={directionalLightRef}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
      />
      
      {/* Luz ambiental para iluminación general */}
      <ambientLight 
        intensity={timeOfDay < 0.2 || timeOfDay > 0.8 ? 0.1 : 0.3} 
        color={timeOfDay < 0.2 || timeOfDay > 0.8 ? 0x2d3748 : 0x87ceeb}
      />
      
      {/* Luz hemisférica para simular luz del cielo */}
      <hemisphereLight
        skyColor={timeOfDay < 0.2 || timeOfDay > 0.8 ? 0x2d3748 : 0x87ceeb}
        groundColor={0x8b4513}
        intensity={timeOfDay < 0.2 || timeOfDay > 0.8 ? 0.1 : 0.2}
      />
    </group>
  )
}

// Hook para controlar el ciclo día/noche
export const useDayNightCycle = (cycleSpeed = 0.001) => {
  const timeRef = useRef(0.5) // Empezar al mediodía
  
  useFrame((state, delta) => {
    timeRef.current += delta * cycleSpeed
    if (timeRef.current > 1) {
      timeRef.current = 0
    }
  })
  
  return timeRef.current
}