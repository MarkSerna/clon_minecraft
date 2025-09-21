import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../hooks/useStore'
import * as THREE from 'three'

export const PlayerHands = () => {
  const leftHandRef = useRef()
  const rightHandRef = useRef()
  const heldItemRef = useRef()
  
  const [isBreaking, setIsBreaking] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)
  const [animationTime, setAnimationTime] = useState(0)
  
  const { texture } = useStore()
  
  // Escuchar eventos de mouse para animaciones
  useState(() => {
    const handleMouseDown = (event) => {
      if (event.button === 0) { // Clic izquierdo - romper
        setIsBreaking(true)
        setAnimationTime(0)
      } else if (event.button === 2) { // Clic derecho - construir
        setIsBuilding(true)
        setAnimationTime(0)
      }
    }
    
    const handleMouseUp = () => {
      setIsBreaking(false)
      setIsBuilding(false)
      setAnimationTime(0)
    }
    
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])
  
  useFrame((state, delta) => {
    if (leftHandRef.current && rightHandRef.current) {
      const time = state.clock.elapsedTime
      
      // Animación de caminar (balanceo sutil de las manos)
      const walkAnimation = Math.sin(time * 8) * 0.1
      
      if (isBreaking) {
        // Animación de romper bloques (movimiento rápido hacia adelante)
        setAnimationTime(prev => prev + delta * 8)
        const breakMotion = Math.sin(animationTime * 10) * 0.3
        
        rightHandRef.current.rotation.x = -0.5 + breakMotion
        rightHandRef.current.position.z = -0.3 + breakMotion * 0.2
        
        // Mano izquierda se mueve menos
        leftHandRef.current.rotation.x = -0.2 + breakMotion * 0.3
      } else if (isBuilding) {
        // Animación de construir (movimiento hacia adelante y arriba)
        setAnimationTime(prev => prev + delta * 6)
        const buildMotion = Math.sin(animationTime * 6) * 0.2
        
        rightHandRef.current.rotation.x = -0.3 + buildMotion
        rightHandRef.current.position.y = -0.8 + buildMotion * 0.1
        rightHandRef.current.position.z = -0.2 + buildMotion * 0.15
      } else {
        // Animación idle con balanceo sutil
        rightHandRef.current.rotation.x = -0.3 + walkAnimation * 0.1
        rightHandRef.current.rotation.y = 0.1 + walkAnimation * 0.05
        rightHandRef.current.position.y = -0.8 + walkAnimation * 0.02
        rightHandRef.current.position.z = -0.2
        
        leftHandRef.current.rotation.x = -0.3 - walkAnimation * 0.1
        leftHandRef.current.rotation.y = -0.1 - walkAnimation * 0.05
        leftHandRef.current.position.y = -0.8 - walkAnimation * 0.02
      }
      
      // Actualizar el item en la mano
      if (heldItemRef.current) {
        heldItemRef.current.position.copy(rightHandRef.current.position)
        heldItemRef.current.rotation.copy(rightHandRef.current.rotation)
        heldItemRef.current.position.x += 0.1
        heldItemRef.current.position.y += 0.2
        heldItemRef.current.position.z += 0.1
      }
    }
  })
  
  // Obtener color del bloque seleccionado
  const getBlockColor = (texture) => {
    const colors = {
      dirt: '#8B4513',
      grass: '#228B22',
      glass: '#87CEEB',
      wood: '#DEB887',
      log: '#654321',
      stone: '#696969',
      coal: '#2F4F4F',
      iron: '#C0C0C0',
      diamond: '#B0E0E6'
    }
    return colors[texture] || '#8B4513'
  }
  
  return (
    <group>
      {/* Mano derecha */}
      <group ref={rightHandRef} position={[0.3, -0.8, -0.2]}>
        {/* Brazo */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshLambertMaterial color="#FDBCB4" />
        </mesh>
        
        {/* Mano */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
          <meshLambertMaterial color="#FDBCB4" />
        </mesh>
        
        {/* Manga */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.12, 0.2, 0.12]} />
          <meshLambertMaterial color="#4169E1" />
        </mesh>
      </group>
      
      {/* Mano izquierda */}
      <group ref={leftHandRef} position={[-0.3, -0.8, -0.2]}>
        {/* Brazo */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshLambertMaterial color="#FDBCB4" />
        </mesh>
        
        {/* Mano */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
          <meshLambertMaterial color="#FDBCB4" />
        </mesh>
        
        {/* Manga */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.12, 0.2, 0.12]} />
          <meshLambertMaterial color="#4169E1" />
        </mesh>
      </group>
      
      {/* Item en la mano (bloque seleccionado) */}
      <mesh ref={heldItemRef} position={[0.4, -0.6, -0.1]} scale={[0.3, 0.3, 0.3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={getBlockColor(texture)} />
      </mesh>
    </group>
  )
}

// Componente para la vista en primera persona mejorada
export const FirstPersonView = ({ children }) => {
  return (
    <group>
      {children}
      <PlayerHands />
    </group>
  )
}