import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Ground } from './components/Ground.jsx'
import { FPV as Fpv } from './components/FPV.jsx'
import { Player } from './components/Player.jsx'
import { Cubes } from './components/Cubes.jsx'
import { Hotbar } from './components/Hotbar.jsx'
import { Particles } from './components/Particles.jsx'
import { ProceduralTerrain } from './components/ProceduralTerrain.jsx'
import { Lighting, useDayNightCycle } from './components/Lighting.jsx'
import { useStore } from './hooks/useStore.js'

function App () {
  const [particles, playerPosition] = useStore(state => [state.particles, state.playerPosition])
  const timeOfDay = useDayNightCycle(0.0005) // Ciclo lento para testing

  return (
    <>
      <Canvas shadows>
        <Sky sunPosition={[100, 100, 20]} />
        <Lighting timeOfDay={timeOfDay} />
        <Fpv />

        <Physics>
          <ProceduralTerrain playerPosition={playerPosition} />
          <Cubes />
          <Player />
          <Ground />
        </Physics>
        
        {particles.map(particle => (
          <Particles
            key={particle.id}
            position={particle.position}
            texture={particle.texture}
          />
        ))}
      </Canvas>
      <div className='pointer'>+</div>
      <Hotbar />
    </>
  )
}

export default App
