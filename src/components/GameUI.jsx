import React, { useState } from 'react'
import { WorldManager } from './WorldManager'
import { useStore } from '../hooks/useStore'

export const GameUI = () => {
  const [showWorldManager, setShowWorldManager] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const playerPosition = useStore(state => state.playerPosition)
  
  return (
    <>
      {/* HUD Principal */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 100,
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      }}>
        <div>Posición: X: {Math.round(playerPosition[0])}, Y: {Math.round(playerPosition[1])}, Z: {Math.round(playerPosition[2])}</div>
      </div>
      
      {/* Menú de botones */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button
          onClick={() => setShowWorldManager(true)}
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: '2px solid #4CAF50',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(76, 175, 80, 0.3)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.7)'
          }}
        >
          📁 Mundos
        </button>
        
        <button
          onClick={() => setShowSettings(true)}
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: '2px solid #2196F3',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(33, 150, 243, 0.3)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.7)'
          }}
        >
          ⚙️ Config
        </button>
      </div>
      
      {/* Crosshair */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        <div style={{
          width: '20px',
          height: '2px',
          backgroundColor: 'white',
          position: 'absolute',
          top: '-1px',
          left: '-10px',
          boxShadow: '0 0 4px rgba(0,0,0,0.8)'
        }} />
        <div style={{
          width: '2px',
          height: '20px',
          backgroundColor: 'white',
          position: 'absolute',
          top: '-10px',
          left: '-1px',
          boxShadow: '0 0 4px rgba(0,0,0,0.8)'
        }} />
      </div>
      
      {/* Inventario/Hotbar */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        gap: '5px',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        borderRadius: '10px'
      }}>
        {['🟫', '🟩', '🟦', '🟪', '🟨', '🟧', '🟥', '⬜', '⬛'].map((block, index) => (
          <div
            key={index}
            style={{
              width: '50px',
              height: '50px',
              background: index === 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = index === 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            {block}
          </div>
        ))}
      </div>
      
      {/* Controles de ayuda */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 100,
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div><strong>Controles:</strong></div>
        <div>WASD - Mover</div>
        <div>Espacio - Saltar</div>
        <div>Click - Romper bloque</div>
        <div>Click derecho - Colocar bloque</div>
        <div>ESC - Liberar cursor</div>
      </div>
      
      {/* Modales */}
      <WorldManager 
        isOpen={showWorldManager} 
        onClose={() => setShowWorldManager(false)} 
      />
      
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '30px',
            borderRadius: '10px',
            width: '400px',
            color: 'white',
            fontFamily: 'Arial, sans-serif'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0 }}>Configuración</h2>
              <button 
                onClick={() => setShowSettings(false)}
                style={{
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Sensibilidad del mouse:</label>
              <input 
                type="range" 
                min="0.1" 
                max="2" 
                step="0.1" 
                defaultValue="1"
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Distancia de renderizado:</label>
              <input 
                type="range" 
                min="50" 
                max="200" 
                step="10" 
                defaultValue="100"
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" defaultChecked />
                Mostrar FPS
              </label>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" defaultChecked />
                Sombras habilitadas
              </label>
            </div>
            
            <button
              onClick={() => setShowSettings(false)}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      )}
    </>
  )
}