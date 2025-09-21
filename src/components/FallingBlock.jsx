import { useBox } from '@react-three/cannon'
import { useState, useEffect } from 'react'
import { useStore } from '../hooks/useStore.js'
import * as textures from '../images/textures.js'

export const FallingBlock = ({ position, texture, onLanded }) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    type: 'Dynamic'
  }))
  
  const [addCube] = useStore(state => [state.addCube])
  const [hasLanded, setHasLanded] = useState(false)
  const activeTexture = textures[texture + 'Texture']
  
  // Detectar cuando el bloque ha aterrizado
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((velocity) => {
      // Si la velocidad es muy baja y no ha aterrizado aún
      if (Math.abs(velocity[1]) < 0.1 && !hasLanded) {
        setHasLanded(true)
        
        // Obtener posición final
        api.position.subscribe((finalPos) => {
          const roundedPos = [
            Math.round(finalPos[0]),
            Math.round(finalPos[1]),
            Math.round(finalPos[2])
          ]
          
          // Agregar bloque estático en la posición final
          addCube(roundedPos[0], roundedPos[1], roundedPos[2])
          
          // Notificar que el bloque ha aterrizado
          if (onLanded) {
            onLanded()
          }
        })
      }
    })
    
    return unsubscribe
  }, [api, hasLanded, addCube, onLanded])
  
  // No renderizar si ya aterrizado
  if (hasLanded) {
    return null
  }
  
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxBufferGeometry attach='geometry' />
      <meshStandardMaterial
        map={activeTexture}
        attach='material'
      />
    </mesh>
  )
}