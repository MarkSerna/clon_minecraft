import create from 'zustand'
import { nanoid } from 'nanoid'

export const useStore = create((set) => ({
  texture: 'dirt',
  cubes: [],
  playerPosition: [0, 10, 0], // Posición inicial del jugador más alta
  worldSeed: 12345,
  inventory: {
    dirt: 64,
    grass: 64,
    glass: 64,
    wood: 64,
    log: 64,
    stone: 64,
    cobblestone: 64,
    sand: 64,
    gravel: 64,
    coalOre: 64,
    ironOre: 64
  },
  particles: [],
  addCube: (x, y, z) => {
    set(state => ({
      cubes: [...state.cubes, {
        id: nanoid(),
        texture: state.texture,
        pos: [x, y, z]
      }]
    }))
  },
  removeCube: (id) => {
    set(state => ({
      cubes: state.cubes.filter(cube => cube.id !== id)
    }))
  },
  setTexture: (texture) => {
    set(() => ({ texture }))
  },
  addParticles: (position, texture) => {
    set(state => ({
      particles: [...state.particles, {
        id: nanoid(),
        position,
        texture,
        createdAt: Date.now()
      }]
    }))
  },
  removeParticles: (id) => {
    set(state => ({
      particles: state.particles.filter(p => p.id !== id)
    }))
  },
  updatePlayerPosition: (position) => {
    set(() => ({ playerPosition: position }))
  },
  saveWorld: () => {},
  resetWorld: () => {}
}))
