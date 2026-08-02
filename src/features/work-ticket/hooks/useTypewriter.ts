import { useState, useEffect, useRef, useCallback } from 'react'

let sharedAudioCtx: AudioContext | null = null

function getAudioCtx(): AudioContext | null {
  if (sharedAudioCtx) return sharedAudioCtx
  try {
    const Ctor =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    sharedAudioCtx = new Ctor()
    return sharedAudioCtx
  } catch {
    return null
  }
}

function playClick() {
  const ctx = getAudioCtx()
  if (!ctx) return
  try {
    const sr = ctx.sampleRate
    const len = Math.ceil(sr * 0.022)
    const buf = ctx.createBuffer(1, len, sr)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) {
      const decay = Math.exp(-i / (len * 0.12))
      data[i] = (Math.random() * 2 - 1) * decay
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    const gain = ctx.createGain()
    gain.gain.value = 0.022
    src.connect(gain)
    gain.connect(ctx.destination)
    src.start()
  } catch {
    // silently ignore
  }
}

interface UseTypewriterOptions {
  text: string
  active: boolean
  onComplete?: () => void
}

export function useTypewriter({ text, active, onComplete }: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const tickRef = useRef(0)

  const reset = useCallback(() => {
    setDisplayedText('')
    setIsComplete(false)
    tickRef.current = 0
  }, [])

  useEffect(() => {
    if (!active) {
      reset()
      return
    }

    reset()

    // Adaptive speed: shorter messages type a bit slower, very long ones faster
    const charSpeed = Math.max(16, 46 - Math.floor(text.length / 12))
    let index = 0
    let soundCounter = 0

    const interval = setInterval(() => {
      index++
      setDisplayedText(text.slice(0, index))

      soundCounter++
      // Play sound every ~2 chars, skip whitespace
      if (soundCounter % 2 === 0 && text[index - 1] !== ' ' && text[index - 1] !== '\n') {
        playClick()
      }

      if (index >= text.length) {
        clearInterval(interval)
        setIsComplete(true)
        onCompleteRef.current?.()
      }
    }, charSpeed)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, active])

  return { displayedText, isComplete }
}