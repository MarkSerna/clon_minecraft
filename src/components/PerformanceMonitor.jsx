import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stats } from '@react-three/drei'

// Monitor de rendimiento principal
export const PerformanceMonitor = ({ showStats = true, onPerformanceChange }) => {
  const [fps, setFps] = useState(60)
  const [frameTime, setFrameTime] = useState(16.67)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [drawCalls, setDrawCalls] = useState(0)
  const [triangles, setTriangles] = useState(0)
  
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fpsHistory = useRef([])
  
  const { gl, scene } = useThree()
  
  useFrame(() => {
    frameCount.current++
    const currentTime = performance.now()
    const deltaTime = currentTime - lastTime.current
    
    // Calcular FPS cada segundo
    if (deltaTime >= 1000) {
      const currentFps = Math.round((frameCount.current * 1000) / deltaTime)
      setFps(currentFps)
      setFrameTime(deltaTime / frameCount.current)
      
      // Mantener historial de FPS
      fpsHistory.current.push(currentFps)
      if (fpsHistory.current.length > 60) {
        fpsHistory.current.shift()
      }
      
      // Estadísticas de renderizado
      if (gl.info) {
        setDrawCalls(gl.info.render.calls)
        setTriangles(gl.info.render.triangles)
      }
      
      // Memoria (si está disponible)
      if (performance.memory) {
        setMemoryUsage(Math.round(performance.memory.usedJSHeapSize / 1024 / 1024))
      }
      
      // Callback para cambios de rendimiento
      if (onPerformanceChange) {
        const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
        onPerformanceChange({
          fps: currentFps,
          avgFps: Math.round(avgFps),
          frameTime: deltaTime / frameCount.current,
          memoryUsage,
          drawCalls,
          triangles
        })
      }
      
      frameCount.current = 0
      lastTime.current = currentTime
    }
  })
  
  return (
    <>
      {showStats && <Stats />}
      <PerformanceHUD 
        fps={fps}
        frameTime={frameTime}
        memoryUsage={memoryUsage}
        drawCalls={drawCalls}
        triangles={triangles}
      />
    </>
  )
}

// HUD de estadísticas de rendimiento
const PerformanceHUD = ({ fps, frameTime, memoryUsage, drawCalls, triangles }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'F3') {
        setIsVisible(!isVisible)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isVisible])
  
  if (!isVisible) return null
  
  const getFpsColor = (fps) => {
    if (fps >= 50) return '#4CAF50'
    if (fps >= 30) return '#FF9800'
    return '#F44336'
  }
  
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <div style={{ color: getFpsColor(fps), fontWeight: 'bold' }}>
        FPS: {fps}
      </div>
      <div>Frame Time: {frameTime.toFixed(2)}ms</div>
      <div>Memory: {memoryUsage}MB</div>
      <div>Draw Calls: {drawCalls}</div>
      <div>Triangles: {triangles.toLocaleString()}</div>
      <div style={{ marginTop: '5px', fontSize: '10px', opacity: 0.7 }}>
        Press F3 to toggle
      </div>
    </div>
  )
}

// Sistema de optimización automática
export const usePerformanceOptimization = () => {
  const [settings, setSettings] = useState({
    renderDistance: 100,
    shadowQuality: 'high',
    particleCount: 100,
    lodEnabled: true,
    cullingEnabled: true
  })
  
  const [performanceLevel, setPerformanceLevel] = useState('high')
  
  const handlePerformanceChange = (stats) => {
    const { avgFps } = stats
    
    // Ajustar configuraciones basadas en el rendimiento
    if (avgFps < 30 && performanceLevel !== 'low') {
      setPerformanceLevel('low')
      setSettings({
        renderDistance: 50,
        shadowQuality: 'low',
        particleCount: 25,
        lodEnabled: true,
        cullingEnabled: true
      })
    } else if (avgFps >= 30 && avgFps < 50 && performanceLevel !== 'medium') {
      setPerformanceLevel('medium')
      setSettings({
        renderDistance: 75,
        shadowQuality: 'medium',
        particleCount: 50,
        lodEnabled: true,
        cullingEnabled: true
      })
    } else if (avgFps >= 50 && performanceLevel !== 'high') {
      setPerformanceLevel('high')
      setSettings({
        renderDistance: 100,
        shadowQuality: 'high',
        particleCount: 100,
        lodEnabled: false,
        cullingEnabled: false
      })
    }
  }
  
  return {
    settings,
    performanceLevel,
    handlePerformanceChange,
    setSettings
  }
}

// Componente de configuraciones de rendimiento
export const PerformanceSettings = ({ onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState({
    renderDistance: 100,
    shadowQuality: 'high',
    particleCount: 100,
    vsync: true,
    antialiasing: true,
    bloom: true,
    fog: true
  })
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'F4') {
        setIsOpen(!isOpen)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])
  
  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    if (onSettingsChange) {
      onSettingsChange(newSettings)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      zIndex: 2000,
      minWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>
        Performance Settings
      </h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Render Distance: {settings.renderDistance}m</label>
        <input
          type="range"
          min="25"
          max="200"
          value={settings.renderDistance}
          onChange={(e) => handleSettingChange('renderDistance', parseInt(e.target.value))}
          style={{ width: '100%', marginTop: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Shadow Quality:</label>
        <select
          value={settings.shadowQuality}
          onChange={(e) => handleSettingChange('shadowQuality', e.target.value)}
          style={{ width: '100%', marginTop: '5px', padding: '5px' }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="ultra">Ultra</option>
        </select>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Particle Count: {settings.particleCount}</label>
        <input
          type="range"
          min="10"
          max="200"
          value={settings.particleCount}
          onChange={(e) => handleSettingChange('particleCount', parseInt(e.target.value))}
          style={{ width: '100%', marginTop: '5px' }}
        />
      </div>
      
      {['vsync', 'antialiasing', 'bloom', 'fog'].map(setting => (
        <div key={setting} style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={settings[setting]}
              onChange={(e) => handleSettingChange(setting, e.target.checked)}
              style={{ marginRight: '10px' }}
            />
            {setting.charAt(0).toUpperCase() + setting.slice(1)}
          </label>
        </div>
      ))}
      
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Close (F4)
        </button>
      </div>
    </div>
  )
}

// Hook para gestión de LOD (Level of Detail)
export const useLOD = (position, playerPosition, distances = [25, 50, 100]) => {
  const [lodLevel, setLodLevel] = useState(0)
  
  useFrame(() => {
    if (playerPosition) {
      const distance = Math.sqrt(
        Math.pow(position[0] - playerPosition[0], 2) +
        Math.pow(position[1] - playerPosition[1], 2) +
        Math.pow(position[2] - playerPosition[2], 2)
      )
      
      let newLodLevel = distances.length
      for (let i = 0; i < distances.length; i++) {
        if (distance <= distances[i]) {
          newLodLevel = i
          break
        }
      }
      
      if (newLodLevel !== lodLevel) {
        setLodLevel(newLodLevel)
      }
    }
  })
  
  return lodLevel
}