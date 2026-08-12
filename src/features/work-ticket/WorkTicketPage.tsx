import { useState, useRef, useCallback, useEffect, type CSSProperties, type MouseEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { NavPill } from '../../components/NavPill'
import { workTicketDialogue } from './data/workTicketDialogue'
import DialogueBlock from './components/DialogueBlock'
import CustomCursor from './components/CustomCursor'

// Type declaration for confetti loaded from CDN
declare global {
  interface Window {
    confetti: (options: any) => void;
  }
}

type CursorState = 'reading' | 'ready' | 'restart'

export function WorkTicketPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [skipAnimation, setSkipAnimation] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 })
  const [inZone, setInZone] = useState(false)
  const [cursorSide, setCursorSide] = useState<'left' | 'right' | null>(null)
  const [cursorReady, setCursorReady] = useState(false)
  const [showBeginningHint, setShowBeginningHint] = useState(false)
  
  // Drag functionality (from Home page)
  const [cam, setCam] = useState<{ x: number; y: number; z: number }>(() => ({
    x: 0,
    y: 0,
    z: 1,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, startY: 0, camX: 0, camY: 0 });
  const vel = useRef({ vx: 0, vy: 0, px: 0, py: 0, t: 0 });
  const raf = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null)
  const dialogueRefs = useRef<(HTMLDivElement | null)[]>([])
  const readyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isFinished = activeIndex >= workTicketDialogue.length - 1 && isTypingComplete

  const cursorState: CursorState = (() => {
    if (!inZone) return 'reading'
    // Left side: always show arrow unless at beginning
    if (cursorSide === 'left' && activeIndex === 0) return 'reading'
    // Right side: show restart if finished
    if (isFinished && cursorSide === 'right') return 'restart'
    // Show ready state when in zone (arrows always visible per user request)
    return 'ready'
  })()

  // Auto-scroll to active dialogue
  useEffect(() => {
    const el = dialogueRefs.current[activeIndex]
    if (!el || !containerRef.current) return
    const container = containerRef.current
    const elCenter = el.offsetTop + el.offsetHeight / 2
    container.scrollTo({ top: elCenter - container.clientHeight / 2, behavior: 'smooth' })
    
    // Reset camera when moving to new dialogue
    setCam({ x: 0, y: 0, z: 1 });
  }, [activeIndex])

  // Cursor ready state - always ready when in zone (per user request for always-show arrows)
  useEffect(() => {
    if (readyTimerRef.current) clearTimeout(readyTimerRef.current)
    // Always set cursor ready when in zone
    if (inZone) {
      readyTimerRef.current = setTimeout(() => setCursorReady(true), 100)
    } else {
      setCursorReady(false)
    }
    return () => {
      if (readyTimerRef.current) clearTimeout(readyTimerRef.current)
    }
  }, [inZone])

  const checkZone = useCallback((clientX: number): { inZone: boolean; side: 'left' | 'right' | null } => {
    const w = window.innerWidth
    const colWidth = Math.min(680, w * 0.82)
    const left = (w - colWidth) / 2
    const right = left + colWidth
    const center = left + colWidth / 2

    if (clientX >= left && clientX <= right) {
      return { inZone: true, side: clientX < center ? 'left' : 'right' }
    }
    return { inZone: false, side: null }
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
      const { inZone, side } = checkZone(e.clientX)
      setInZone(inZone)
      setCursorSide(side)
    },
    [checkZone]
  )

  const handleMouseLeave = useCallback(() => setInZone(false), [])

  // ── Success sound and confetti for conversation completion ─────────────────────────
  const playSuccessSound = useCallback(() => {
    const audio = new Audio('/success.mov')
    audio.volume = 0.4
    audio.play().catch((error) => {
      console.error('Success sound playback failed:', error)
    })
  }, [])

  const launchConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      // Launch confetti from left and right sides
      window.confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });
      window.confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, [])

  const advance = useCallback(() => {
    if (isFinished) {
      setActiveIndex(0)
      setIsTypingComplete(false)
      setSkipAnimation(false)
      setCursorReady(false)
      setCam({ x: 0, y: 0, z: 1 });
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setActiveIndex((prev) => Math.min(prev + 1, workTicketDialogue.length - 1))
      setIsTypingComplete(false)
      setSkipAnimation(false)
      setCursorReady(false)
    }
  }, [isFinished, containerRef])

  const goBack = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1)
      setIsTypingComplete(true)
      setSkipAnimation(true)
      setCursorReady(true)
    }
  }, [activeIndex])

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const { inZone, side } = checkZone(e.clientX)
      if (!inZone) return

      if (!isTypingComplete) {
        // Complete current typewriter instantly on click
        setSkipAnimation(true)
        return
      }

      // Left side: go back, Right side: go forward
      if (side === 'left') {
        if (activeIndex > 0) {
          goBack()
        } else {
          // Show hint that we're at the beginning
          setShowBeginningHint(true)
          setTimeout(() => setShowBeginningHint(false), 1500)
        }
      } else {
        advance()
      }
    },
    [checkZone, isTypingComplete, advance, goBack, activeIndex]
  )

  const handleTypingComplete = useCallback(() => setIsTypingComplete(true), [])

  // Trigger success sound and confetti when conversation finishes
  useEffect(() => {
    if (isFinished && isTypingComplete) {
      // Play success sound immediately when conversation ends
      setTimeout(() => {
        playSuccessSound();
      }, 500); // Wait 0.5 seconds before sound
      
      // Launch confetti 1 second after sound
      setTimeout(() => {
        launchConfetti();
      }, 1500); // Wait 1.5 seconds total before confetti
    }
  }, [isFinished, isTypingComplete, playSuccessSound, launchConfetti])

  // ── Drag functionality (from Home page) ─────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on interactive elements — they handle their own events
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, [data-no-drag]")) return;

    // Ignore clicks inside the dialogue interaction zone
    const { inZone } = checkZone(e.clientX)
    if (inZone) return;

    if (raf.current !== null) { cancelAnimationFrame(raf.current); raf.current = null; }

    drag.current = { active: true, startX: e.clientX, startY: e.clientY, camX: cam.x, camY: cam.y };
    vel.current = { vx: 0, vy: 0, px: e.clientX, py: e.clientY, t: performance.now() };

    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [cam.x, cam.y, checkZone]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;

    const now = performance.now();
    const dt = now - vel.current.t;
    if (dt > 0) {
      vel.current.vx = (e.clientX - vel.current.px) / dt;
      vel.current.vy = (e.clientY - vel.current.py) / dt;
      vel.current.px = e.clientX;
      vel.current.py = e.clientY;
      vel.current.t = now;
    }

    setCam({
      x: drag.current.camX + (e.clientX - drag.current.startX),
      y: drag.current.camY + (e.clientY - drag.current.startY),
      z: cam.z,
    });
  }, [cam.z]);

  const onPointerUp = useCallback(() => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);

    let { vx, vy } = vel.current;
    const FRICTION = 0.88;

    function step() {
      vx *= FRICTION;
      vy *= FRICTION;
      if (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05) { raf.current = null; return; }
      setCam(c => ({ x: c.x + vx * 16, y: c.y + vy * 16, z: c.z }));
      raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
  }, []);

  // ── Keyboard navigation ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowLeft' || e.key === 'Backspace') && document.activeElement === document.body) {
        e.preventDefault()
        goBack()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goBack])

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100vh',
    backgroundColor: '#000000',
    cursor: inZone ? 'none' : (isDragging ? 'grabbing' : 'grab'),
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'none',
  }

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <CustomCursor x={cursorPos.x} y={cursorPos.y} state={cursorState} visible={inZone} side={cursorSide} />

      {/* Conversation column */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 620,
          margin: '0 auto',
          padding: '80px 28px 250px',
          display: 'flex',
          flexDirection: 'column',
          gap: 64,
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`,
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* Title */}
        <p
          style={{
            fontFamily: "'Lato', sans-serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 18,
            lineHeight: '22.5px',
            letterSpacing: '0.9px',
            color: 'rgba(255,255,255,0.38)',
            textAlign: 'center',
            margin: 0,
            marginBottom: -16,
            userSelect: 'none',
          }}
        >
          Example of Working a Ticket
        </p>

        {/* Render dialogues 0..activeIndex */}
        {workTicketDialogue.slice(0, activeIndex + 1).map((entry, i) => (
          <DialogueBlock
            key={entry.id}
            ref={(el) => {
              dialogueRefs.current[i] = el
            }}
            entry={entry}
            state={i === activeIndex ? 'active' : 'completed'}
            skipAnimation={i === activeIndex ? skipAnimation : false}
            onTypingComplete={i === activeIndex ? handleTypingComplete : undefined}
          />
        ))}

        {/* End-of-conversation hint */}
        {isFinished && (
          <p
            style={{
              fontFamily: "'Lato', sans-serif",
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.22)',
              textAlign: 'center',
              margin: 0,
              marginTop: -24,
              animation: 'fadeSlideIn 0.6s ease forwards',
              opacity: 0,
              userSelect: 'none',
            }}
          >
            Click to restart
          </p>
        )}
      </div>

      {/* Beginning hint */}
      <AnimatePresence>
        {showBeginningHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: 120,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: "'Lato', sans-serif",
              fontStyle: 'italic',
              fontSize: 12,
              color: 'rgba(255,255,255,0.3)',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 100,
            }}
          >
            You're at the beginning
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation pill */}
      <NavPill active="work" onNavigate={() => {}} />

      {/* CSS animations */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes cursorPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes iconGlow {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(255,255,255,0.3)); }
          50% { filter: drop-shadow(0 0 8px rgba(255,255,255,0.6)); }
        }
        @keyframes bulbPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}