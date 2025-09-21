import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'

export const useParticles = () => {
  const [particles, setParticles] = useState([])
  
  const addParticles = useCallback((position, texture, type = 'break') => {
    const particleId = nanoid()
    const newParticle = {
      id: particleId,
      position,
      texture,
      type,
      createdAt: Date.now()
    }
    
    setParticles(prev => [...prev, newParticle])
    
    // Remover partículas después de 2 segundos
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particleId))
    }, 2000)
  }, [])
  
  const clearParticles = useCallback(() => {
    setParticles([])
  }, [])
  
  return {
    particles,
    addParticles,
    clearParticles
  }
}