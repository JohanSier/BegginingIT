import { useRef, useState } from "react"
import chatIcon from "../../imports/Chat_Conversation_Circle.svg"
import videoFillIcon from "../../imports/VIdeo_fill.svg"
import "./CallFlow.css"

const CALL_FLOW_AUDIO_SOURCE = "/audio/call-flow-example.mp3"

const callFlowSteps = [
  "— Hello [User], Good Afternoon My Name is [Your Name] with the SOS team. How's your (Day) (Afternoon) going?",
  "— I'm reaching out because of the ticket that you opened with us.",
  "— Just to let you know this call is being recorded for quality and training purposes.",
  "— Would it be okay if we do another quick verification?",
]

export default function CallFlow() {
  const [isHovered, setIsHovered] = useState(false)
  const [audioUnavailable, setAudioUnavailable] = useState(false)
  const [chatIconLoaded, setChatIconLoaded] = useState(false)
  const [videoIconLoaded, setVideoIconLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const playExample = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      audio.currentTime = 0
      await audio.play()
      setAudioUnavailable(false)
    } catch {
      // The file is intentionally expected at this stable URL once it is attached.
      setAudioUnavailable(true)
    }
  }

  return (
    <aside
      className={`call-flow ${isHovered ? "is-hovered" : ""}`}
      aria-label="Call flow guide"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
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

        <button className="call-flow__play" type="button" onClick={playExample} aria-describedby={audioUnavailable ? "call-flow-audio-status" : undefined}>
          <img 
            src={videoFillIcon} 
            alt="" 
            className="call-flow__play-icon" 
            loading="eager"
            onLoad={() => setVideoIconLoaded(true)}
          />
          <span>Play Example</span>
          <span>2:00</span>
        </button>
        <span id="call-flow-audio-status" className="call-flow__audio-status" role="status">
          {audioUnavailable ? "Example audio will be available when the MP3 is attached." : ""}
        </span>
      </div>

      <button className="call-flow__trigger" type="button" aria-expanded={isHovered}>
        <CallFlowLabel />
      </button>

      <audio ref={audioRef} preload="none" src={CALL_FLOW_AUDIO_SOURCE} onError={() => setAudioUnavailable(true)} />
    </aside>
  )
}

function CallFlowLabel() {
  return (
    <span className="call-flow__label">
      <img src={chatIcon} alt="" className="call-flow__chat-icon" />
      <span>Call Flow</span>
    </span>
  )
}
