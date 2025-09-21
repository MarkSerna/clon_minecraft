import { useState, useEffect, useCallback } from 'react'
import { TerrainGenerator } from '../utils/noise'

export const useWorld = (seed = 12345) => {
  const [chunks, setChunks] = useState(new Map())
  const [terrainGenerator] = useState(() => new TerrainGenerator(seed))
  const [loadedChunks, setLoadedChunks] = useState(new Set())
  
  const CHUNK_SIZE = 16
  const RENDER_DISTANCE = 2 // Chunks a cargar alrededor del jugador
  
  // Obtener coordenadas de chunk desde posición mundial
  const getChunkCoords = useCallback((x, z) => {
    return [
      Math.floor(x / CHUNK_SIZE),
      Math.floor(z / CHUNK_SIZE)
    ]
  }, [])
  
  // Generar clave única para chunk
  const getChunkKey = useCallback((chunkX, chunkZ) => {
    return `${chunkX},${chunkZ}`
  }, [])
  
  // Cargar un chunk específico
  const loadChunk = useCallback((chunkX, chunkZ) => {
    const chunkKey = getChunkKey(chunkX, chunkZ)
    
    if (loadedChunks.has(chunkKey)) {
      return chunks.get(chunkKey)
    }
    
    // Generar nuevo chunk
    const chunkBlocks = terrainGenerator.generateChunk(chunkX, chunkZ, CHUNK_SIZE)
    
    setChunks(prev => new Map(prev).set(chunkKey, chunkBlocks))
    setLoadedChunks(prev => new Set(prev).add(chunkKey))
    
    return chunkBlocks
  }, [chunks, loadedChunks, terrainGenerator, getChunkKey])
  
  // Cargar chunks alrededor de una posición
  const loadChunksAroundPosition = useCallback((playerX, playerZ) => {
    const [centerChunkX, centerChunkZ] = getChunkCoords(playerX, playerZ)
    
    const chunksToLoad = []
    
    for (let x = centerChunkX - RENDER_DISTANCE; x <= centerChunkX + RENDER_DISTANCE; x++) {
      for (let z = centerChunkZ - RENDER_DISTANCE; z <= centerChunkZ + RENDER_DISTANCE; z++) {
        const chunkKey = getChunkKey(x, z)
        if (!loadedChunks.has(chunkKey)) {
          chunksToLoad.push([x, z])
        }
      }
    }
    
    // Cargar chunks de forma asíncrona para no bloquear la UI
    chunksToLoad.forEach(([x, z]) => {
      setTimeout(() => loadChunk(x, z), 0)
    })
  }, [getChunkCoords, getChunkKey, loadedChunks, loadChunk])
  
  // Obtener todos los bloques visibles
  const getVisibleBlocks = useCallback(() => {
    const allBlocks = []
    
    chunks.forEach(chunkBlocks => {
      allBlocks.push(...chunkBlocks)
    })
    
    return allBlocks
  }, [chunks])
  
  // Obtener altura del terreno en una posición
  const getTerrainHeight = useCallback((x, z) => {
    return terrainGenerator.getHeightAt(x, z)
  }, [terrainGenerator])
  
  // Verificar si una posición está ocupada por terreno
  const isTerrainAt = useCallback((x, y, z) => {
    const height = getTerrainHeight(x, z)
    return y <= height
  }, [getTerrainHeight])
  
  // Limpiar chunks lejanos para optimizar memoria
  const cleanupDistantChunks = useCallback((playerX, playerZ) => {
    const [centerChunkX, centerChunkZ] = getChunkCoords(playerX, playerZ)
    const maxDistance = RENDER_DISTANCE + 1
    
    const chunksToRemove = []
    
    loadedChunks.forEach(chunkKey => {
      const [chunkX, chunkZ] = chunkKey.split(',').map(Number)
      const distance = Math.max(
        Math.abs(chunkX - centerChunkX),
        Math.abs(chunkZ - centerChunkZ)
      )
      
      if (distance > maxDistance) {
        chunksToRemove.push(chunkKey)
      }
    })
    
    if (chunksToRemove.length > 0) {
      setChunks(prev => {
        const newChunks = new Map(prev)
        chunksToRemove.forEach(key => newChunks.delete(key))
        return newChunks
      })
      
      setLoadedChunks(prev => {
        const newSet = new Set(prev)
        chunksToRemove.forEach(key => newSet.delete(key))
        return newSet
      })
    }
  }, [getChunkCoords, loadedChunks])
  
  return {
    loadChunksAroundPosition,
    getVisibleBlocks,
    getTerrainHeight,
    isTerrainAt,
    cleanupDistantChunks,
    loadedChunksCount: loadedChunks.size,
    totalBlocks: getVisibleBlocks().length
  }
}