import { useRef, useCallback } from 'react'

let audioElement: HTMLAudioElement | null = null
let isPlaying = false
let playQueue: number | null = null

function getAudioElement(): HTMLAudioElement {
  if (!audioElement) {
    audioElement = new Audio('/marked-sound.mov')
    audioElement.volume = 0.3 // Appropriate volume for UI sound
  }
  return audioElement
}

export function usePinSound() {
  const playSound = useCallback(() => {
    const audio = getAudioElement()
    
    // If currently playing, wait for it to finish
    if (isPlaying) {
      // Queue a delayed play
      if (playQueue) clearTimeout(playQueue)
      playQueue = window.setTimeout(() => {
        isPlaying = false
        playSound()
      }, 500) // Wait 500ms before trying again
      return
    }

    isPlaying = true
    audio.currentTime = 0 // Reset to beginning
    
    audio.play().then(() => {
      audio.onended = () => {
        isPlaying = false
      }
    }).catch((error) => {
      console.error('Sound playback failed:', error)
      isPlaying = false
    })
  }, [])

  return { playSound }
}