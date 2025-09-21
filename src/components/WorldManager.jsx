import React, { useState, useEffect } from 'react'
import { useWorldSave } from '../hooks/useWorldSave'

export const WorldManager = ({ isOpen, onClose }) => {
  const [savedWorlds, setSavedWorlds] = useState([])
  const [newWorldName, setNewWorldName] = useState('')
  const [newWorldSeed, setNewWorldSeed] = useState('')
  const [activeTab, setActiveTab] = useState('load') // 'load', 'create'
  const [loading, setLoading] = useState(false)
  
  const { 
    saveWorld, 
    loadWorld, 
    getSavedWorlds, 
    deleteWorld, 
    createNewWorld,
    exportWorld 
  } = useWorldSave()
  
  // Cargar mundos guardados al abrir
  useEffect(() => {
    if (isOpen) {
      const worlds = getSavedWorlds()
      setSavedWorlds(worlds)
    }
  }, [isOpen, getSavedWorlds])
  
  const handleSaveCurrentWorld = async () => {
    if (!newWorldName.trim()) {
      alert('Por favor ingresa un nombre para el mundo')
      return
    }
    
    setLoading(true)
    const success = saveWorld(newWorldName.trim())
    
    if (success) {
      setNewWorldName('')
      const worlds = getSavedWorlds()
      setSavedWorlds(worlds)
      alert('Mundo guardado exitosamente!')
    } else {
      alert('Error al guardar el mundo')
    }
    setLoading(false)
  }
  
  const handleLoadWorld = async (worldName) => {
    setLoading(true)
    const success = loadWorld(worldName)
    
    if (success) {
      alert(`Mundo "${worldName}" cargado exitosamente!`)
      onClose()
    } else {
      alert('Error al cargar el mundo')
    }
    setLoading(false)
  }
  
  const handleCreateNewWorld = async () => {
    if (!newWorldName.trim()) {
      alert('Por favor ingresa un nombre para el mundo')
      return
    }
    
    setLoading(true)
    const seed = newWorldSeed.trim() ? parseInt(newWorldSeed) : null
    const success = createNewWorld(newWorldName.trim(), seed)
    
    if (success) {
      setNewWorldName('')
      setNewWorldSeed('')
      alert('Nuevo mundo creado exitosamente!')
      onClose()
    } else {
      alert('Error al crear el mundo')
    }
    setLoading(false)
  }
  
  const handleDeleteWorld = async (worldName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el mundo "${worldName}"?`)) {
      const success = deleteWorld(worldName)
      
      if (success) {
        const worlds = getSavedWorlds()
        setSavedWorlds(worlds)
        alert('Mundo eliminado exitosamente!')
      } else {
        alert('Error al eliminar el mundo')
      }
    }
  }
  
  const handleExportWorld = (worldName) => {
    exportWorld(worldName)
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }
  
  if (!isOpen) return null
  
  return (
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
        width: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Gestor de Mundos</h2>
          <button 
            onClick={onClose}
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
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          marginBottom: '20px',
          borderBottom: '1px solid #444'
        }}>
          <button
            onClick={() => setActiveTab('load')}
            style={{
              background: activeTab === 'load' ? '#4CAF50' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              borderRadius: '5px 5px 0 0'
            }}
          >
            Cargar Mundo
          </button>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              background: activeTab === 'create' ? '#4CAF50' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              borderRadius: '5px 5px 0 0'
            }}
          >
            Crear/Guardar
          </button>
        </div>
        
        {/* Contenido de tabs */}
        {activeTab === 'load' && (
          <div>
            <h3>Mundos Guardados</h3>
            {savedWorlds.length === 0 ? (
              <p style={{ color: '#888' }}>No hay mundos guardados</p>
            ) : (
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {savedWorlds.map((world) => (
                  <div key={world.name} style={{
                    backgroundColor: '#3a3a3a',
                    padding: '15px',
                    marginBottom: '10px',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{world.name}</h4>
                      <p style={{ margin: '0', fontSize: '12px', color: '#aaa' }}>
                        Creado: {formatDate(world.createdAt)}
                      </p>
                      <p style={{ margin: '0', fontSize: '12px', color: '#aaa' }}>
                        Última vez jugado: {formatDate(world.lastPlayed)}
                      </p>
                      <p style={{ margin: '0', fontSize: '12px', color: '#aaa' }}>
                        Bloques: {world.cubes?.length || 0} | Seed: {world.seed}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleLoadWorld(world.name)}
                        disabled={loading}
                        style={{
                          background: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Cargar
                      </button>
                      <button
                        onClick={() => handleExportWorld(world.name)}
                        style={{
                          background: '#2196F3',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Exportar
                      </button>
                      <button
                        onClick={() => handleDeleteWorld(world.name)}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'create' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3>Guardar Mundo Actual</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Nombre del mundo"
                  value={newWorldName}
                  onChange={(e) => setNewWorldName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #555',
                    backgroundColor: '#444',
                    color: 'white'
                  }}
                />
                <button
                  onClick={handleSaveCurrentWorld}
                  disabled={loading}
                  style={{
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
            
            <div>
              <h3>Crear Nuevo Mundo</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Nombre del nuevo mundo"
                  value={newWorldName}
                  onChange={(e) => setNewWorldName(e.target.value)}
                  style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #555',
                    backgroundColor: '#444',
                    color: 'white'
                  }}
                />
                <input
                  type="number"
                  placeholder="Seed (opcional)"
                  value={newWorldSeed}
                  onChange={(e) => setNewWorldSeed(e.target.value)}
                  style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #555',
                    backgroundColor: '#444',
                    color: 'white'
                  }}
                />
                <button
                  onClick={handleCreateNewWorld}
                  disabled={loading}
                  style={{
                    background: '#FF9800',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Crear Mundo
                </button>
              </div>
            </div>
          </div>
        )}
        
        {loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px'
          }}>
            <div style={{ color: 'white', fontSize: '18px' }}>Cargando...</div>
          </div>
        )}
      </div>
    </div>
  )
}