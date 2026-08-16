import { forwardRef, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { DialogueEntry, DialogueState } from '../types'
import { useTypewriter } from '../hooks/useTypewriter'

// Import SVG paths for badges
import svgPathsUser from '../../../imports/Group18/svg-2app3oq84x'
import svgPathsMentor from '../../../imports/Group19/svg-cukm4u87w6'

// Use public folder paths for images
const imgRobot = '/imports/robot.svg'
const imgMentor = '/imports/mentor.png'
const imgBombilla = '/imports/bulb.png'

const badgeTextStyle: CSSProperties = {
  fontFamily: "'Lato', sans-serif",
  fontStyle: 'italic',
  fontWeight: 700,
  fontSize: 10.714,
  lineHeight: '13.626px',
  color: '#000',
  letterSpacing: '0.545px',
  whiteSpace: 'nowrap',
  margin: 0,
  userSelect: 'none',
}

// ─── Speech-bubble badges (exact design path shapes) ─────────────────────────
function UserBadge({ dim }: { dim: boolean }) {
  return (
    <div style={{ position: 'relative', width: 54.643, height: 14, opacity: dim ? 0.4 : 1, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: '-5.74% 0.17% -5.74% 0.31%' }}>
        <svg fill="none" height="15.5266" preserveAspectRatio="none" viewBox="0 0 54.3783 15.5266" width="54.3783" style={{ display: 'block', width: '100%', height: '100%', filter: 'drop-shadow(0 1px 8px white)' }}>
          <path d={svgPathsUser.p1430fd80} fill="#FFFCFC" stroke="white" strokeWidth="0.799031" />
        </svg>
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={badgeTextStyle}>User</p>
      </div>
    </div>
  )
}

function MentorBadge({ dim }: { dim: boolean }) {
  return (
    <div style={{ position: 'relative', width: 61, height: 14, opacity: dim ? 0.4 : 1, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: '-5.74% 0.36% -5.74% 0.51%' }}>
        <svg fill="none" height="15.5266" preserveAspectRatio="none" viewBox="0 0 60.4704 15.5266" width="60.4704" style={{ display: 'block', width: '100%', height: '100%', filter: 'drop-shadow(0 1px 8px white)' }}>
          <path d={svgPathsMentor.p1e13fa00} fill="#FFFCFC" stroke="white" strokeWidth="0.799031" />
        </svg>
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={badgeTextStyle}>Mentor</p>
      </div>
    </div>
  )
}

// ─── User avatar — robot SVG, no container circle ───────────────────────────
function UserAvatar({ dim }: { dim: boolean }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={imgRobot}
      alt="User"
      loading="eager"
      onLoad={() => setLoaded(true)}
      style={{ 
        width: 52, 
        height: 52, 
        objectFit: 'contain', 
        flexShrink: 0, 
        opacity: dim ? 0.38 : (loaded ? 1 : 0), 
        transition: 'opacity 0.3s ease', 
        filter: 'drop-shadow(0 1px 8px white)' 
      }}
    />
  )
}

// ─── Mentor avatar — with bulb positioned diagonally top-right of the head ──
function MentorAvatar({ dim, active, showBulb }: { dim: boolean; active: boolean; showBulb: boolean }) {
  const [mentorLoaded, setMentorLoaded] = useState(false)
  const [bulbLoaded, setBulbLoaded] = useState(false)

  return (
    // Outer div provides room for the overflowing diagonal bulb
    <div style={{ position: 'relative', width: 52, paddingTop: showBulb ? 14 : 0, flexShrink: 0, filter: 'drop-shadow(0 1px 8px white)' }}>
      {/* Mentor face — no circle, just crop */}
      <div
        style={{
          width: 52,
          height: 50,
          overflow: 'hidden',
          opacity: dim ? 0.35 : (mentorLoaded ? 1 : 0),
          transition: 'opacity 0.3s ease',
          animation: active ? 'iconGlow 2s ease-in-out infinite' : 'none',
        }}
      >
        <img
          src={imgMentor}
          alt="Mentor"
          loading="eager"
          onLoad={() => setMentorLoaded(true)}
          style={{ position: 'relative', width: '208%', height: '143%', marginLeft: '-55%', marginTop: '-14%', maxWidth: 'none', pointerEvents: 'none' }}
        />
      </div>

      {/* Light bulb — diagonally positioned top-right of the mentor head */}
      {showBulb && (
        <img
          src={imgBombilla}
          alt="Key insight"
          loading="eager"
          onLoad={() => setBulbLoaded(true)}
          style={{
            position: 'absolute',
            // top of mentor div; 14px above face because we added paddingTop:14
            top: 0,
            right: -10,
            width: 25,
            height: 25,
            opacity: dim ? 0.38 : (bulbLoaded ? 1 : 0),
            animation: active && !dim ? 'bulbPulse 1.8s ease-in-out infinite' : 'none',
            transition: 'opacity 0.3s ease',
            filter: 'drop-shadow(0 1px 8px #ffff00)',
          }}
        />
      )}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
interface DialogueBlockProps {
  entry: DialogueEntry
  state: DialogueState
  skipAnimation?: boolean
  onTypingComplete?: () => void
}

// W-words only highlighted in entry id=3, case-sensitive. Other tokens always highlighted.
function highlightText(text: string, baseColor: string, includeWWords: boolean) {
  const re = includeWWords
    ? /(Who|What|Where|When|Why|1st|2nd|3rd|#521251)/g
    : /(1st|2nd|3rd|#521251)/g
  const parts = text.split(re)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span
        key={i}
        style={{
          fontWeight: 700,
          fontSize: 14,
          textDecoration: 'underline',
          textDecorationThickness: '1px',
          textUnderlineOffset: '2px',
          color: baseColor,
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  )
}

const textStyle: CSSProperties = {
  fontFamily: "'Lato', sans-serif",
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: 12,
  lineHeight: '22.5px',
  letterSpacing: '0.9px',
  whiteSpace: 'pre-line',
  margin: 0,
}

const DialogueBlock = forwardRef<HTMLDivElement, DialogueBlockProps>(
  ({ entry, state, skipAnimation, onTypingComplete }, ref) => {
    const isActive = state === 'active'
    const isUser = entry.speaker === 'user'
    const dim = state === 'completed'
    const onCompleteRef = useRef(onTypingComplete)
    onCompleteRef.current = onTypingComplete

    const { displayedText, isComplete } = useTypewriter({
      text: entry.message,
      active: isActive && !skipAnimation,
      onComplete: onTypingComplete,
    })

    useEffect(() => {
      if (isActive && skipAnimation && onCompleteRef.current) {
        onCompleteRef.current()
      }
    }, [isActive, skipAnimation])

    const visibleText = state === 'completed' || (isActive && skipAnimation) ? entry.message : displayedText

    const textColor = dim ? 'rgba(255,255,255,0.38)' : '#ffffff'

    const caret =
      isActive && !isComplete && !skipAnimation ? (
        <span
          style={{
            display: 'inline-block',
            width: 1.5,
            height: '1em',
            background: 'rgba(255,255,255,0.9)',
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            animation: 'blink 0.75s step-end infinite',
          }}
        />
      ) : null

    // ── User ────────────────────────────────────────────────────────────────
    // Fixed paddingLeft keeps the avatar anchored — text grows right without shifting.
    if (isUser) {
      return (
        <div ref={ref} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingLeft: 110, animation: 'fadeSlideIn 0.4s ease forwards', opacity: 0 }}>
          <UserAvatar dim={dim} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <UserBadge dim={dim} />
            <p style={{ ...textStyle, color: textColor, textAlign: 'left', maxWidth: 290, transition: 'color 0.5s ease' }}>
              {highlightText(visibleText, textColor, entry.id === 3)}{caret}
            </p>
          </div>
        </div>
      )
    }

    // ── Mentor ──────────────────────────────────────────────────────────────
    return (
      <div ref={ref} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 12, animation: 'fadeSlideIn 0.4s ease forwards', opacity: 0, marginRight: '50px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <MentorBadge dim={dim} />
          <p style={{ ...textStyle, color: textColor, textAlign: 'right', maxWidth: 334, transition: 'color 0.5s ease' }}>
            {highlightText(visibleText, textColor, entry.id === 3)}{caret}
          </p>
        </div>
        <MentorAvatar dim={dim} active={isActive && !dim} showBulb={!!entry.important} />
      </div>
    )
  }
)

DialogueBlock.displayName = 'DialogueBlock'

export default DialogueBlock
