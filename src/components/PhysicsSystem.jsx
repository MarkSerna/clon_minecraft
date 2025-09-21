import { useEffect } from 'react'
import { usePhysics } from '../hooks/usePhysics'
import { FallingBlock } from './FallingBlock'

export const PhysicsSystem = () => {
  const { fallingBlocks, applyGravity, removeFallingBlock, checkGravityAround } = usePhysics()
  
  // Aplicar gravedad periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      applyGravity()
    }, 1000) // Verificar cada segundo
    
    return () => clearInterval(interval)
  }, [applyGravity])
  
  return (
    <group name="physics-system">
      {fallingBlocks.map(block => (
        <FallingBlock
          key={block.id}
          position={block.position}
          texture={block.texture}
          onLanded={() => removeFallingBlock(block.id)}
        />
      ))}
    </group>
  )
}