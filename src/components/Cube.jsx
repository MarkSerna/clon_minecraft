import { useStore } from '../hooks/useStore.js'
import { useBox } from '@react-three/cannon'
import { useState } from 'react'
import * as textures from '../images/textures.js'
import { useAudio } from '../hooks/useAudio.js'

export const Cube = ({ id, position, texture, isTerrainBlock = false }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [removeCube, addCube, addParticles] = useStore(state => [
    state.removeCube, 
    state.addCube, 
    state.addParticles
  ])
  const { playPlaceSound, playBreakSound } = useAudio()

  const [ref] = useBox(() => ({
    type: 'Static',
    position
  }))

  const activeTexture = textures[texture + 'Texture']

  const handleClick = (e) => {
    e.stopPropagation()

    // Clic izquierdo (botón 0) = ROMPER bloque
    if (e.nativeEvent.button === 0) {
      // Los bloques de terreno requieren más tiempo para romperse
      if (isTerrainBlock) {
        // TODO: Implementar sistema de minado con tiempo
        console.log('Minando bloque de terreno...')
        return
      }
      
      // Agregar partículas al romper bloque
      addParticles(position, texture)
      playBreakSound()
      removeCube(id)
      return
    }

    // Clic derecho (botón 2) = CONSTRUIR bloque
    if (e.nativeEvent.button === 2) {
      // Obtener la cara clickeada basada en la normal
      const clickedFace = e.face.normal
      const [x, y, z] = position

      // Calcular la nueva posición basada en la cara clickeada
      let newX = x
      let newY = y
      let newZ = z

      // Determinar la dirección basada en la normal de la cara
      if (Math.abs(clickedFace.x) > 0.5) {
        // Cara lateral (izquierda o derecha)
        newX += clickedFace.x > 0 ? 1 : -1
      } else if (Math.abs(clickedFace.y) > 0.5) {
        // Cara superior o inferior
        newY += clickedFace.y > 0 ? 1 : -1
      } else if (Math.abs(clickedFace.z) > 0.5) {
        // Cara frontal o trasera
        newZ += clickedFace.z > 0 ? 1 : -1
      }

      addCube(newX, newY, newZ)
      // Agregar partículas al colocar bloque
      addParticles([newX, newY, newZ], texture)
      playPlaceSound()
    }
  }

  return (
    <mesh
      onPointerMove={(e) => {
        e.stopPropagation()
        setIsHovered(true)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setIsHovered(false)
      }}
      ref={ref}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      <boxBufferGeometry attach='geometry' />
      <meshStandardMaterial
        color={isHovered ? 'grey' : 'white'}
        transparent
        map={activeTexture}
        attach='material'
      />
    </mesh>
  )
}
