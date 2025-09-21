import { useCallback } from 'react'
import { useStore } from './useStore'

export const useWorldSave = () => {
  const [cubes, worldSeed, playerPosition] = useStore(state => [
    state.cubes, 
    state.worldSeed, 
    state.playerPosition
  ])
  
  // Guardar mundo actual
  const saveWorld = useCallback((worldName) => {
    try {
      const worldData = {
        name: worldName,
        cubes: cubes,
        seed: worldSeed,
        playerPosition: playerPosition,
        createdAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString(),
        version: '2.0'
      }
      
      // Obtener mundos existentes
      const existingWorlds = JSON.parse(localStorage.getItem('minecraft-worlds') || '{}')
      
      // Agregar o actualizar mundo
      existingWorlds[worldName] = worldData
      
      // Guardar en localStorage
      localStorage.setItem('minecraft-worlds', JSON.stringify(existingWorlds))
      
      console.log(`Mundo "${worldName}" guardado exitosamente`)
      return true
    } catch (error) {
      console.error('Error al guardar mundo:', error)
      return false
    }
  }, [cubes, worldSeed, playerPosition])
  
  // Cargar mundo específico
  const loadWorld = useCallback((worldName) => {
    try {
      const existingWorlds = JSON.parse(localStorage.getItem('minecraft-worlds') || '{}')
      const worldData = existingWorlds[worldName]
      
      if (!worldData) {
        console.error(`Mundo "${worldName}" no encontrado`)
        return false
      }
      
      // Actualizar store con datos del mundo
      useStore.setState({
        cubes: worldData.cubes || [],
        worldSeed: worldData.seed || 12345,
        playerPosition: worldData.playerPosition || [0, 10, 0]
      })
      
      // Actualizar última vez jugado
      worldData.lastPlayed = new Date().toISOString()
      existingWorlds[worldName] = worldData
      localStorage.setItem('minecraft-worlds', JSON.stringify(existingWorlds))
      
      console.log(`Mundo "${worldName}" cargado exitosamente`)
      return true
    } catch (error) {
      console.error('Error al cargar mundo:', error)
      return false
    }
  }, [])
  
  // Obtener lista de mundos guardados
  const getSavedWorlds = useCallback(() => {
    try {
      const existingWorlds = JSON.parse(localStorage.getItem('minecraft-worlds') || '{}')
      return Object.keys(existingWorlds).map(name => ({
        name,
        ...existingWorlds[name]
      }))
    } catch (error) {
      console.error('Error al obtener mundos guardados:', error)
      return []
    }
  }, [])
  
  // Eliminar mundo
  const deleteWorld = useCallback((worldName) => {
    try {
      const existingWorlds = JSON.parse(localStorage.getItem('minecraft-worlds') || '{}')
      
      if (!existingWorlds[worldName]) {
        console.error(`Mundo "${worldName}" no encontrado`)
        return false
      }
      
      delete existingWorlds[worldName]
      localStorage.setItem('minecraft-worlds', JSON.stringify(existingWorlds))
      
      console.log(`Mundo "${worldName}" eliminado exitosamente`)
      return true
    } catch (error) {
      console.error('Error al eliminar mundo:', error)
      return false
    }
  }, [])
  
  // Crear nuevo mundo
  const createNewWorld = useCallback((worldName, seed = null) => {
    try {
      const newSeed = seed || Math.floor(Math.random() * 1000000)
      
      // Resetear estado del juego
      useStore.setState({
        cubes: [],
        worldSeed: newSeed,
        playerPosition: [0, 10, 0]
      })
      
      // Guardar mundo nuevo
      return saveWorld(worldName)
    } catch (error) {
      console.error('Error al crear nuevo mundo:', error)
      return false
    }
  }, [saveWorld])
  
  // Exportar mundo como JSON
  const exportWorld = useCallback((worldName) => {
    try {
      const existingWorlds = JSON.parse(localStorage.getItem('minecraft-worlds') || '{}')
      const worldData = existingWorlds[worldName]
      
      if (!worldData) {
        console.error(`Mundo "${worldName}" no encontrado`)
        return null
      }
      
      const exportData = JSON.stringify(worldData, null, 2)
      
      // Crear y descargar archivo
      const blob = new Blob([exportData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${worldName}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      return exportData
    } catch (error) {
      console.error('Error al exportar mundo:', error)
      return null
    }
  }, [])
  
  return {
    saveWorld,
    loadWorld,
    getSavedWorlds,
    deleteWorld,
    createNewWorld,
    exportWorld
  }
}