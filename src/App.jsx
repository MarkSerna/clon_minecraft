import { Canvas } from '@react-three/fiber'
import { Sky, PointerLockControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Ground } from './components/Ground.jsx'
import { Player } from './components/Player.jsx'
import { Cubes } from './components/Cubes.jsx'
import { TextureSelector } from './components/TextureSelect.jsx'
import { ProceduralTerrain } from './components/ProceduralTerrain.jsx'
import { Lighting, useDayNightCycle } from './components/Lighting.jsx'
import { PhysicsSystem } from './components/PhysicsSystem.jsx'
import { GameUI } from './components/GameUI.jsx'
import { useStore } from './hooks/useStore.js'

function App() {
  const [playerPosition] = useStore(state => [state.playerPosition])

  return (
    <>
      <Canvas shadows camera={{ fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <Lighting />
        <Physics>
          <Cubes />
          <Player />
          <Ground />
          <ProceduralTerrain playerPosition={playerPosition} />
          <PhysicsSystem />
        </Physics>
        <PointerLockControls />
      </Canvas>
      <div className='absolute centered cursor'>+</div>
      <TextureSelector />
      <GameUI />
    </>
  )
}

export default App
