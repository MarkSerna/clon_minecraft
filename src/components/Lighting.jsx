import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DirectionalLight, Vector3, Color } from 'three'

export const Lighting = () => {
  const timeOfDay = useDayNightCycle()
  const directionalLightRef = useRef()
  const ambientLightRef = useRef()
  const shadowCameraRef = useRef()
  
  useFrame(() => {
    if (directionalLightRef.current && ambientLightRef.current) {
      // Calcular posición del sol basada en el tiempo del día
      const sunAngle = (timeOfDay - 0.25) * Math.PI * 2 // -0.25 para que el mediodía sea arriba
      const sunHeight = Math.sin(sunAngle) * 0.8 + 0.2 // Entre 0.2 y 1.0
      const sunDistance = 100
      
      // Posición del sol
      const sunX = Math.cos(sunAngle) * sunDistance
      const sunY = Math.max(sunHeight * sunDistance, 10) // Mínimo altura de 10
      const sunZ = Math.sin(sunAngle) * sunDistance * 0.3
      
      directionalLightRef.current.position.set(sunX, sunY, sunZ)
      directionalLightRef.current.target.position.set(0, 0, 0)
      directionalLightRef.current.target.updateMatrixWorld()
      
      // Intensidad de la luz basada en la altura del sol
      const lightIntensity = Math.max(sunHeight, 0.1) * 2
      directionalLightRef.current.intensity = lightIntensity
      
      // Color de la luz basado en el tiempo del día
      let lightColor
      if (sunHeight > 0.8) {
        // Mediodía - luz blanca brillante
        lightColor = new Color(1, 1, 0.95)
      } else if (sunHeight > 0.3) {
        // Día normal - luz ligeramente cálida
        lightColor = new Color(1, 0.95, 0.8)
      } else if (sunHeight > 0) {
        // Amanecer/atardecer - luz naranja/rojiza
        const t = sunHeight / 0.3
        lightColor = new Color(1, 0.6 + t * 0.35, 0.3 + t * 0.5)
      } else {
        // Noche - luz azul muy tenue
        lightColor = new Color(0.3, 0.4, 0.8)
      }
      
      directionalLightRef.current.color = lightColor
      
      // Luz ambiente basada en el tiempo del día
      const ambientIntensity = Math.max(sunHeight * 0.4, 0.05)
      ambientLightRef.current.intensity = ambientIntensity
      
      // Color ambiente
      let ambientColor
      if (sunHeight > 0.5) {
        ambientColor = new Color(0.4, 0.4, 0.5) // Día - azul cielo
      } else if (sunHeight > 0) {
        const t = sunHeight / 0.5
        ambientColor = new Color(0.2 + t * 0.2, 0.2 + t * 0.2, 0.3 + t * 0.2)
      } else {
        ambientColor = new Color(0.1, 0.1, 0.2) // Noche - azul oscuro
      }
      
      ambientLightRef.current.color = ambientColor
      
      // Configurar sombras dinámicas
      if (directionalLightRef.current.shadow) {
        const shadow = directionalLightRef.current.shadow
        
        // Ajustar el tamaño de la cámara de sombras basado en la intensidad
        const shadowSize = 50 + lightIntensity * 20
        shadow.camera.left = -shadowSize
        shadow.camera.right = shadowSize
        shadow.camera.top = shadowSize
        shadow.camera.bottom = -shadowSize
        shadow.camera.near = 0.1
        shadow.camera.far = 200
        
        // Calidad de sombras basada en la intensidad de luz
        const shadowMapSize = lightIntensity > 1 ? 2048 : 1024
        shadow.mapSize.width = shadowMapSize
        shadow.mapSize.height = shadowMapSize
        
        // Suavidad de sombras
        shadow.radius = 4
        shadow.blurSamples = 25
        
        shadow.camera.updateProjectionMatrix()
      }
    }
  })

  return (
    <>
      {/* Luz direccional (sol) */}
      <directionalLight
        ref={directionalLightRef}
        intensity={1.5}
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
      
      {/* Luz ambiente */}
      <ambientLight ref={ambientLightRef} intensity={0.3} />
      
      {/* Luz de relleno para evitar sombras completamente negras */}
      <hemisphereLight
        skyColor={0x87CEEB} // Azul cielo
        groundColor={0x8B4513} // Marrón tierra
        intensity={0.2}
      />
      
      {/* Luz puntual para efectos especiales (opcional) */}
      <pointLight
        position={[0, 20, 0]}
        intensity={0.1}
        distance={100}
        decay={2}
        color={0xffffff}
      />
    </>
  )
}

// Hook para el ciclo día/noche mejorado
export const useDayNightCycle = (speed = 0.0002) => {
  const timeRef = useRef(0.25) // Empezar en el mediodía
  
  useFrame((state, delta) => {
    timeRef.current += speed * delta * 60 // 60 FPS normalizados
    if (timeRef.current > 1) {
      timeRef.current = 0
    }
  })
  
  return timeRef.current
}