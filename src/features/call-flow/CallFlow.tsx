import { useRef, useState } from "react"
import chatIcon from "../../imports/Chat_Conversation_Circle.svg"
import videoFillIcon from "../../imports/VIdeo_fill.svg"
import stopFillIcon from "../../imports/Stop_fill.svg"
import resetIcon from "../../imports/reset-left-line.svg"
import "./CallFlow.css"

const CALL_FLOW_AUDIO_SOURCE = "/audio/recordingExample.mp3"
const AUDIO_DURATION = 230 // 3:50 in seconds

const callFlowSteps = [
  "— Hello [User], Good Afternoon My Name is [Your Name] with the SOS team. How's your (Day) (Afternoon) going?",
  "— I'm reaching out because of the ticket that you opened with us.",
  "— Just to let you know this call is being recorded for quality and training purposes.",
  "— Would it be okay if we do another quick verification?",
]

export default function CallFlow() {
  const [isHovered, setIsHovered] = useState(false)
  const [audioUnavailable, setAudioUnavailable] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [hasPaused, setHasPaused] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const timeUpdateIntervalRef = useRef<number | null>(null)

  const togglePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setHasPaused(true)
      } else {
        // Only reset to 0 if it's the first time playing
        if (!hasPlayed) {
          audio.currentTime = 0
          setCurrentTime(0)
        }
        await audio.play()
        setAudioUnavailable(false)
        setHasPlayed(true)
      }
    } catch {
      // The file is intentionally expected at this stable URL once it is attached.
      setAudioUnavailable(true)
    }
  }

  const resetAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    setCurrentTime(0)
    if (isPlaying) {
      audio.pause()
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
      timeUpdateIntervalRef.current = null
    }
  }

  const handleAudioPause = () => {
    setIsPlaying(false)
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
      timeUpdateIntervalRef.current = null
    }
  }

  const handleAudioPlay = () => {
    setIsPlaying(true)
    // Start time tracking
    timeUpdateIntervalRef.current = window.setInterval(() => {
      const audio = audioRef.current
      if (audio) {
        setCurrentTime(audio.currentTime)
      }
    }, 100)
  }

  const handlePointerLeave = () => {
    setIsHovered(false)
    const audio = audioRef.current
    if (audio && isPlaying) {
      audio.pause()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <aside
      className={`call-flow ${isHovered ? "is-hovered" : ""}`}
      aria-label="Call flow guide"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
    >
      <div className="call-flow__panel">
        <div className="call-flow__header">
          <CallFlowLabel />
        </div>

        <div className="call-flow__script">
          {callFlowSteps.map((step) => (
            <p key={step}>{step}</p>
          ))}
          <p>
            I just sent you a push notification to your cellphone through the Microsoft Authenticator app, could you confirm the sign in belongs to you?
          </p>
          <p className="call-flow__or">OR</p>
          <p>
            I just sent you an SMS message to your cellphone ending in: (Last four digits) Could you provide me with the six digit code?
          </p>
          <p>— Alright, let me assist you with this issue, is it okay if I remote into your computer?</p>
          <p>— If anything else comes up feel free to reach out, the SOS will be happy to help. Have a good one!</p>
        </div>

        <div className="call-flow__controls">
          <button className="call-flow__play" type="button" onClick={togglePlayPause} aria-describedby={audioUnavailable ? "call-flow-audio-status" : undefined}>
            <img 
              src={isPlaying ? stopFillIcon : videoFillIcon} 
              alt="" 
              className={`call-flow__play-icon ${isPlaying ? "is-playing" : ""}`} 
              loading="eager"
            />
            <span className={isPlaying ? "is-playing" : ""}>
              {isPlaying ? "Playing" : (hasPlayed && hasPaused ? "Resume" : "Play")}
            </span>
            <span className={isPlaying ? "is-playing" : ""} style={{ marginLeft: "10px" }}>
              {isPlaying ? formatTime(currentTime) : (hasPlayed ? formatTime(currentTime) : formatTime(AUDIO_DURATION))}
            </span>
          </button>
          {hasPlayed && (
            <button className="call-flow__reset" type="button" onClick={resetAudio} aria-label="Reset audio to beginning">
              <img 
                src={resetIcon} 
                alt="" 
                className="call-flow__reset-icon" 
                loading="eager"
              />
            </button>
          )}
        </div>
        <span id="call-flow-audio-status" className="call-flow__audio-status" role="status">
          {audioUnavailable ? "Example audio will be available when the MP3 is attached." : ""}
        </span>
      </div>

      <button className="call-flow__trigger" type="button" aria-expanded={isHovered}>
        <CallFlowLabel />
      </button>

      <audio 
        ref={audioRef} 
        preload="none" 
        src={CALL_FLOW_AUDIO_SOURCE} 
        onError={() => setAudioUnavailable(true)}
        onEnded={handleAudioEnded}
        onPause={handleAudioPause}
        onPlay={handleAudioPlay}
      />
    </aside>
  )
}

function CallFlowLabel() {
  return (
    <span className="call-flow__label">
      <img 
        src={chatIcon} 
        alt="" 
        className="call-flow__chat-icon" 
        loading="eager"
      />
      <span>Call Flow</span>
    </span>
  )
}
