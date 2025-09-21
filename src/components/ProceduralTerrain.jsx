import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorld } from '../hooks/useWorld'
import { Cube } from './Cube'

export const ProceduralTerrain = ({ playerPosition = [0, 0, 0] }) => {
  const world = useWorld()
  const lastPlayerChunk = useRef([0, 0])
  const [terrainBlocks, setTerrainBlocks] = useState([])
  
  // Actualizar terreno basado en posición del jugador
  useEffect(() => {
    const [playerX, , playerZ] = playerPosition
    const currentChunk = [
      Math.floor(playerX / 16),
      Math.floor(playerZ / 16)
    ]
    
    // Solo actualizar si el jugador cambió de chunk
    if (currentChunk[0] !== lastPlayerChunk.current[0] || 
        currentChunk[1] !== lastPlayerChunk.current[1]) {
      
      // Cargar chunks alrededor del jugador
      world.loadChunksAroundPosition(playerX, playerZ)
      
      // Limpiar chunks lejanos
      world.cleanupDistantChunks(playerX, playerZ)
      
      lastPlayerChunk.current = currentChunk
      
      // Actualizar bloques visibles
      setTerrainBlocks(world.getVisibleBlocks())
    }
  }, [playerPosition, world])
  
  // Renderizar bloques del terreno
  return (
    <group name="procedural-terrain">
      {terrainBlocks.map((block, index) => (
        <Cube
          key={`terrain-${block.pos[0]}-${block.pos[1]}-${block.pos[2]}`}
          position={block.pos}
          texture={block.texture}
          isTerrainBlock={true}
        />
      ))}
    </group>
  )
}