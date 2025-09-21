import { usePlane } from '@react-three/cannon'
import { useStore } from '../hooks/useStore.js'
import { groundTexture } from '../images/textures.js'
import { useAudio } from '../hooks/useAudio.js'

export function Ground () {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0]
  }))

  const [addCube, addParticles, texture] = useStore(state => [
    state.addCube, 
    state.addParticles, 
    state.texture
  ])
  const { playPlaceSound } = useAudio()

  groundTexture.repeat.set(100, 100)

  const handleClickGround = event => {
    event.stopPropagation()
    const [x, y, z] = Object.values(event.point)
      .map(n => Math.ceil(n))

    addCube(x, y, z)
    // Agregar partículas al colocar bloque en el suelo
    addParticles([x, y, z], texture)
    playPlaceSound()
  }

  return (
    <mesh
      onClick={handleClickGround}
      ref={ref}
    >
      <planeBufferGeometry attach='geometry' args={[100, 100]} />
      <meshStandardMaterial attach='material' map={groundTexture} />
    </mesh>
  )
}
