import { useState, useCallback } from 'react'
import { useStore } from './useStore'

export const usePhysics = () => {
  const [fallingBlocks, setFallingBlocks] = useState([])
  const [cubes, removeCube] = useStore(state => [state.cubes, state.removeCube])
  
  // Verificar si un bloque tiene soporte debajo
  const hasSupport = useCallback((x, y, z) => {
    // Verificar si hay un bloque directamente debajo
    return cubes.some(cube => 
      cube.pos[0] === x && 
      cube.pos[1] === y - 1 && 
      cube.pos[2] === z
    )
  }, [cubes])
  
  // Verificar si un bloque necesita caer por gravedad
  const shouldFall = useCallback((cube) => {
    const [x, y, z] = cube.pos
    
    // Los bloques en el suelo (y = 1) no caen
    if (y <= 1) return false
    
    // Verificar si tiene soporte
    return !hasSupport(x, y, z)
  }, [hasSupport])
  
  // Aplicar gravedad a bloques sin soporte
  const applyGravity = useCallback(() => {
    const blocksToFall = cubes.filter(shouldFall)
    
    if (blocksToFall.length > 0) {
      // Crear bloques que caen
      const newFallingBlocks = blocksToFall.map(cube => ({
        id: cube.id,
        position: cube.pos,
        texture: cube.texture
      }))
      
      // Remover bloques originales del mundo estático
      blocksToFall.forEach(cube => removeCube(cube.id))
      
      // Agregar a la lista de bloques que caen
      setFallingBlocks(prev => [...prev, ...newFallingBlocks])
    }
  }, [cubes, shouldFall, removeCube])
  
  // Remover bloque que cayó de la lista
  const removeFallingBlock = useCallback((id) => {
    setFallingBlocks(prev => prev.filter(block => block.id !== id))
  }, [])
  
  // Verificar gravedad para bloques específicos (útil cuando se rompe un bloque)
  const checkGravityAround = useCallback((x, y, z) => {
    // Verificar bloques en las posiciones adyacentes que podrían perder soporte
    const positions = [
      [x, y + 1, z], // Arriba
      [x + 1, y + 1, z], // Arriba derecha
      [x - 1, y + 1, z], // Arriba izquierda
      [x, y + 1, z + 1], // Arriba adelante
      [x, y + 1, z - 1], // Arriba atrás
    ]
    
    const blocksToCheck = cubes.filter(cube => 
      positions.some(pos => 
        cube.pos[0] === pos[0] && 
        cube.pos[1] === pos[1] && 
        cube.pos[2] === pos[2]
      )
    )
    
    const blocksToFall = blocksToCheck.filter(shouldFall)
    
    if (blocksToFall.length > 0) {
      const newFallingBlocks = blocksToFall.map(cube => ({
        id: cube.id,
        position: cube.pos,
        texture: cube.texture
      }))
      
      blocksToFall.forEach(cube => removeCube(cube.id))
      setFallingBlocks(prev => [...prev, ...newFallingBlocks])
    }
  }, [cubes, shouldFall, removeCube])
  
  return {
    fallingBlocks,
    applyGravity,
    removeFallingBlock,
    checkGravityAround
  }
}