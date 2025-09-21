import { Canvas } from '@react-three/fiber'
import { Sky, PointerLockControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { Ground } from './components/Ground.jsx'
import { Player } from './components/Player.jsx'
import { Cubes } from './components/Cubes.jsx'
import { TextureSelector } from './components/TextureSelect.jsx'
import { ProceduralTerrain } from './components/ProceduralTerrain.jsx'
import { Lighting, useDayNightCycle } from './components/Lighting.jsx'
import { SkyBox, AtmosphericEffects } from './components/SkyBox.jsx'
import { Water, Lake, Waterfall } from './components/Water.jsx'
import { PerformanceMonitor, PerformanceSettings, usePerformanceOptimization } from './components/PerformanceMonitor.jsx'
import { PhysicsSystem } from './components/PhysicsSystem.jsx'
import { GameUI } from './components/GameUI.jsx'
import { PlayerHands } from './components/PlayerHands.jsx'
import { useStore } from './hooks/useStore.js'

function App() {
  const { playerPosition } = useStore()
  const { settings, handlePerformanceChange } = usePerformanceOptimization()

  return (
    <>
      <Canvas 
        shadows 
        camera={{ fov: 45 }}
        gl={{ 
          antialias: settings.antialiasing,
          powerPreference: "high-performance"
        }}
      >
        <SkyBox />
        <AtmosphericEffects />
        <Physics broadphase="SAP" gravity={[0, -9.81, 0]}>
          <Lighting />
          <Ground />
          <Player />
          <Cubes />
          <ProceduralTerrain />
          <Lake position={[20, 1, 20]} radius={8} />
          <Waterfall position={[35, 15, 10]} height={12} width={3} />
          <Water position={[-15, 1, -10]} size={[8, 1, 12]} />
          <PhysicsSystem />
        </Physics>
        <PointerLockControls />
        <PlayerHands />
        <PerformanceMonitor 
          showStats={true}
          onPerformanceChange={handlePerformanceChange}
        />
      </Canvas>
      <div className='absolute centered cursor'>+</div>
      <TextureSelector />
      <GameUI />
      <PerformanceSettings />
    </>
  )
}

export default App
