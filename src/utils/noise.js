// Implementación de ruido Perlin simplificado para generación de terreno
export class SimplexNoise {
  constructor(seed = Math.random()) {
    this.seed = seed
    this.p = []
    
    // Inicializar tabla de permutación
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(Math.random() * 256)
    }
    
    // Duplicar la tabla para evitar desbordamientos
    for (let i = 0; i < 256; i++) {
      this.p[256 + i] = this.p[i]
    }
  }
  
  // Función de interpolación suave
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }
  
  // Interpolación lineal
  lerp(t, a, b) {
    return a + t * (b - a)
  }
  
  // Función de gradiente
  grad(hash, x, y) {
    const h = hash & 15
    const u = h < 8 ? x : y
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }
  
  // Ruido 2D
  noise2D(x, y) {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    
    x -= Math.floor(x)
    y -= Math.floor(y)
    
    const u = this.fade(x)
    const v = this.fade(y)
    
    const A = this.p[X] + Y
    const AA = this.p[A]
    const AB = this.p[A + 1]
    const B = this.p[X + 1] + Y
    const BA = this.p[B]
    const BB = this.p[B + 1]
    
    return this.lerp(v,
      this.lerp(u, this.grad(this.p[AA], x, y),
                   this.grad(this.p[BA], x - 1, y)),
      this.lerp(u, this.grad(this.p[AB], x, y - 1),
                   this.grad(this.p[BB], x - 1, y - 1))
    )
  }
  
  // Ruido fractal (múltiples octavas)
  fractalNoise2D(x, y, octaves = 4, persistence = 0.5, scale = 0.1) {
    let value = 0
    let amplitude = 1
    let frequency = scale
    let maxValue = 0
    
    for (let i = 0; i < octaves; i++) {
      value += this.noise2D(x * frequency, y * frequency) * amplitude
      maxValue += amplitude
      amplitude *= persistence
      frequency *= 2
    }
    
    return value / maxValue
  }
}

// Generador de terreno
export class TerrainGenerator {
  constructor(seed = Math.random()) {
    this.noise = new SimplexNoise(seed)
    this.seaLevel = 5
    this.maxHeight = 15
  }
  
  // Generar altura del terreno en una posición
  getHeightAt(x, z) {
    // Usar ruido fractal para crear variaciones naturales
    const heightNoise = this.noise.fractalNoise2D(x, z, 4, 0.5, 0.02)
    const height = Math.floor(this.seaLevel + heightNoise * this.maxHeight)
    return Math.max(1, height) // Mínimo altura 1
  }
  
  // Determinar tipo de bloque basado en altura y posición
  getBlockTypeAt(x, y, z) {
    const surfaceHeight = this.getHeightAt(x, z)
    
    if (y > surfaceHeight) {
      return null // Aire
    }
    
    if (y === surfaceHeight) {
      return 'grass' // Superficie
    }
    
    if (y >= surfaceHeight - 3) {
      return 'dirt' // Tierra debajo de la superficie
    }
    
    // Generar minerales en capas profundas
    const oreNoise = this.noise.noise2D(x * 0.1, z * 0.1)
    if (y < 8) {
      if (oreNoise > 0.6) return 'coalOre'
      if (oreNoise < -0.6 && y < 5) return 'ironOre'
    }
    
    return 'stone' // Piedra por defecto
  }
  
  // Generar chunk de terreno
  generateChunk(chunkX, chunkZ, chunkSize = 16) {
    const blocks = []
    
    for (let x = 0; x < chunkSize; x++) {
      for (let z = 0; z < chunkSize; z++) {
        const worldX = chunkX * chunkSize + x
        const worldZ = chunkZ * chunkSize + z
        const height = this.getHeightAt(worldX, worldZ)
        
        for (let y = 1; y <= height; y++) {
          const blockType = this.getBlockTypeAt(worldX, y, worldZ)
          if (blockType) {
            blocks.push({
              pos: [worldX, y, worldZ],
              texture: blockType
            })
          }
        }
      }
    }
    
    return blocks
  }
}