import { useCallback, useRef } from 'react'

export const useAudio = () => {
  const audioContextRef = useRef(null)
  
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])
  
  const playSound = useCallback((frequency, duration = 0.1, type = 'sine', volume = 0.3) => {
    const audioContext = initAudioContext()
    
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }
    
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }, [initAudioContext])
  
  const playPlaceSound = useCallback(() => {
    playSound(440, 0.1, 'square', 0.2) // Sonido de colocación
  }, [playSound])
  
  const playBreakSound = useCallback(() => {
    playSound(220, 0.15, 'sawtooth', 0.25) // Sonido de rotura
  }, [playSound])
  
  const playStepSound = useCallback(() => {
    playSound(150, 0.05, 'triangle', 0.1) // Sonido de pasos
  }, [playSound])
  
  return {
    playPlaceSound,
    playBreakSound,
    playStepSound,
    playSound
  }
}