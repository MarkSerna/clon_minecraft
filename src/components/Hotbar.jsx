import { useStore } from '../hooks/useStore.js'
import * as images from '../images/images.js'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { useEffect, useState } from 'react'

const MATERIALS = [
  'dirt', 'grass', 'glass', 'wood', 'log', 
  'stone', 'cobblestone', 'sand', 'gravel'
]

export const Hotbar = () => {
  const [activeSlot, setActiveSlot] = useState(0)
  const [texture, setTexture] = useStore(state => [state.texture, state.setTexture])
  const [inventory] = useStore(state => [state.inventory])

  const {
    dirt, grass, glass, wood, log,
    stone, cobblestone, sand, gravel, coalOre
  } = useKeyboard()

  // Actualizar slot activo basado en teclas numéricas
  useEffect(() => {
    const keyMappings = {
      dirt: 0, grass: 1, glass: 2, wood: 3, log: 4,
      stone: 5, cobblestone: 6, sand: 7, gravel: 8, coalOre: 8
    }

    const pressedKeys = { dirt, grass, glass, wood, log, stone, cobblestone, sand, gravel, coalOre }
    const activeKey = Object.entries(pressedKeys).find(([key, pressed]) => pressed)
    
    if (activeKey) {
      const [keyName] = activeKey
      const slotIndex = keyMappings[keyName]
      if (slotIndex !== undefined) {
        setActiveSlot(slotIndex)
        setTexture(keyName === 'coalOre' ? 'coalOre' : MATERIALS[slotIndex])
      }
    }
  }, [dirt, grass, glass, wood, log, stone, cobblestone, sand, gravel, coalOre, setTexture])

  // Manejar scroll del ratón
  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault()
      const direction = event.deltaY > 0 ? 1 : -1
      const newSlot = (activeSlot + direction + MATERIALS.length) % MATERIALS.length
      setActiveSlot(newSlot)
      setTexture(MATERIALS[newSlot])
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [activeSlot, setTexture])

  return (
    <div className="hotbar">
      {MATERIALS.map((material, index) => {
        const imageKey = material + 'Img'
        const image = images[imageKey]
        const count = inventory[material] || 64 // Modo creativo: bloques ilimitados
        
        return (
          <div 
            key={material}
            className={`hotbar-slot ${index === activeSlot ? 'active' : ''}`}
            onClick={() => {
              setActiveSlot(index)
              setTexture(material)
            }}
          >
            <img src={image} alt={material} className="hotbar-item" />
            <span className="hotbar-count">{count}</span>
            <span className="hotbar-number">{index + 1}</span>
          </div>
        )
      })}
    </div>
  )
}