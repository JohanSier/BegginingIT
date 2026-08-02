import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { NavPill } from '../../components/NavPill';
import { sampleConversation } from './data/sampleConversation';
import { Dialogue, DialogueState, DialogueWithState } from './types/dialogue';
import { CustomCursor, CursorState } from './components/CustomCursor';
import { Typewriter } from './components/Typewriter';

export function WorkTicketPage() {
  const navigate = useNavigate();
  const [dialogues, setDialogues] = useState<DialogueWithState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorState, setCursorState] = useState<CursorState>('reading');
  
  // Canvas camera state
  const [cam, setCam] = useState<{ x: number; y: number; z: number }>(() => {
    if (typeof window === "undefined") return { x: 0, y: 0, z: 1 };
    return {
      x: 0,
      y: 0,
      z: 1,
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, startY: 0, camX: 0, camY: 0 });
  const vel = useRef({ vx: 0, vy: 0, px: 0, py: 0, t: performance.now() });
  const raf = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  useEffect(() => {
    const initialDialogues: DialogueWithState[] = sampleConversation.map((dialogue, index) => ({
      ...dialogue,
      state: index === 0 ? 'typing' : 'hidden'
    }));
    setDialogues(initialDialogues);
  }, []);

  // Auto-scroll to active dialogue
  useEffect(() => {
    if (currentIndex > 0 && containerRef.current) {
      const activeElement = containerRef.current.children[currentIndex];
      if (activeElement) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        const scrollTarget = elementRect.top - containerRect.top + (containerRect.height / 2) - (elementRect.height / 2);
        
        containerRef.current.scrollTo({
          top: scrollTarget,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  // Inertia physics (same as Home page)
  useEffect(() => {
    function step() {
      const now = performance.now();
      const dt = (now - vel.current.t) / 1000;
      vel.current.t = now;

      if (dt > 0.1) {
        raf.current = requestAnimationFrame(step);
        return;
      }

      const friction = 3.5;
      vel.current.vx *= Math.exp(-friction * dt);
      vel.current.vy *= Math.exp(-friction * dt);

      if (Math.abs(vel.current.vx) < 0.1 && Math.abs(vel.current.vy) < 0.1) {
        vel.current.vx = 0;
        vel.current.vy = 0;
        raf.current = null;
        return;
      }

      setCam(c => ({ ...c, x: c.x + vel.current.vx, y: c.y + vel.current.vy }));
      raf.current = requestAnimationFrame(step);
    }

    if (raf.current !== null) {
      raf.current = requestAnimationFrame(step);
    }

    return () => {
      if (raf.current !== null) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }
    };
  }, []);

  // Canvas pointer handlers
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on interactive elements inside the dialogue area
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, [data-no-drag]")) return;

    // Ignore clicks inside the dialogue interaction area
    const interactionArea = document.querySelector('[data-interaction-area="true"]');
    if (interactionArea && interactionArea.contains(target)) return;

    if (raf.current !== null) { cancelAnimationFrame(raf.current); raf.current = null; }

    drag.current = { active: true, startX: e.clientX, startY: e.clientY, camX: cam.x, camY: cam.y };
    vel.current = { vx: 0, vy: 0, px: e.clientX, py: e.clientY, t: performance.now() };

    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [cam.x, cam.y]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;

    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;

    setCam(c => ({ ...c, x: drag.current.camX + dx, y: drag.current.camY + dy }));

    vel.current.px = e.clientX;
    vel.current.py = e.clientY;
    vel.current.t = performance.now();
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;

    drag.current.active = false;
    setIsDragging(false);

    const now = performance.now();
    const dt = (now - vel.current.t) / 1000;

    if (dt > 0 && dt < 0.1) {
      const vx = (e.clientX - vel.current.px) / dt;
      const vy = (e.clientY - vel.current.py) / dt;
      vel.current.vx = vx;
      vel.current.vy = vy;
      vel.current.t = now;

      if (raf.current === null) {
        raf.current = requestAnimationFrame(step);
      }
    }

    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    // Check if scrolling inside a scrollable element
    const target = e.target as HTMLElement;
    const scrollableElement = target.closest('[style*="overflow"], [style*="overflowY"], [style*="overflowX"]');
    
    if (scrollableElement) {
      const computedStyle = window.getComputedStyle(scrollableElement);
      const overflow = computedStyle.overflow;
      const overflowY = computedStyle.overflowY;
      const overflowX = computedStyle.overflowX;
      
      if ((overflow === 'auto' || overflow === 'scroll' || overflowY === 'auto' || overflowY === 'scroll' || overflowX === 'auto' || overflowX === 'scroll') &&
          (scrollableElement.scrollHeight > scrollableElement.clientHeight || scrollableElement.scrollWidth > scrollableElement.clientWidth)) {
        return;
      }
    }

    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(3, cam.z + delta));

    setCam(c => ({ ...c, z: newZoom }));
  }, [cam.z]);

  function step() {
    const now = performance.now();
    const dt = (now - vel.current.t) / 1000;
    vel.current.t = now;

    if (dt > 0.1) {
      raf.current = requestAnimationFrame(step);
      return;
    }

    const friction = 3.5;
    vel.current.vx *= Math.exp(-friction * dt);
    vel.current.vy *= Math.exp(-friction * dt);

    if (Math.abs(vel.current.vx) < 0.1 && Math.abs(vel.current.vy) < 0.1) {
      vel.current.vx = 0;
      vel.current.vy = 0;
      raf.current = null;
      return;
    }

    setCam(c => ({ ...c, x: c.x + vel.current.vx, y: c.y + vel.current.vy }));
    raf.current = requestAnimationFrame(step);
  }

  // Handle dialogue progression
  const handleAdvance = useCallback(() => {
    const currentDialogue = dialogues[currentIndex];
    
    // Ignore clicks while typing
    if (currentDialogue.state === 'typing') {
      return;
    }

    // Mark current as completed
    setDialogues(prev => {
      const updated = [...prev];
      updated[currentIndex] = { ...updated[currentIndex], state: 'completed' };
      return updated;
    });

    // Move to next dialogue
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setDialogues(prev => {
        const updated = [...prev];
        updated[prev + 1] = { ...updated[prev + 1], state: 'typing' };
        return updated;
      });
    } else {
      // End of conversation - cursor becomes restart
      setCursorState('restart');
    }
  }, [currentIndex, dialogues]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setDialogues(prev => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], state: 'hidden' };
        updated[currentIndex - 1] = { ...updated[currentIndex - 1], state: 'active' };
        return updated;
      });
      setCurrentIndex(prev => prev - 1);
      setCursorState('reading');
    }
  }, [currentIndex]);

  // Handle restart
  const handleRestart = useCallback(() => {
    setDialogues(sampleConversation.map((dialogue, index) => ({
      ...dialogue,
      state: index === 0 ? 'typing' : 'hidden'
    })));
    setCurrentIndex(0);
    setCursorState('reading');
    setCam({ x: 0, y: 0, z: 1 });
  }, []);

  // Handle typing completion
  const handleTypingComplete = useCallback(() => {
    setDialogues(prev => {
      const updated = [...prev];
      updated[currentIndex] = { ...updated[currentIndex], state: 'active' };
      return updated;
    });
    
    // Transition cursor to ready state after typing
    setTimeout(() => {
      setCursorState('ready');
    }, 300);
  }, [currentIndex]);

  // Render user icon
  const UserIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c0-3 3.58-6 8-6s8 3 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  // Render mentor icon
  const MentorIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c0-3 3.58-6 8-6s8 3 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 4l3 3-3 3M21 7h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Render light bulb icon
  const LightBulbIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18h6M12 2v8M9 21a6 6 0 0 1-6 6 6 6 0 0 1 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div 
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: '#000', 
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <CustomCursor state={cursorState} />
      
      {/* Invisible interaction area */}
      <div
        data-interaction-area="true"
        onClick={handleAdvance}
        style={{
          position: 'absolute',
          left: '20%',
          top: '15%',
          width: '60%',
          height: '70%',
          cursor: cursorState === 'reading' ? 'wait' : 'pointer',
          zIndex: 10,
        }}
      />

      {/* Back button */}
      {currentIndex > 0 && (
        <button
          onClick={handleBack}
          style={{
            position: 'fixed',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            color: '#fff',
            fontFamily: 'Lato, sans-serif',
            fontStyle: 'italic',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 100,
          }}
        >
          Back
        </button>
      )}

      {/* Navigation pill */}
      <NavPill active="work" onNavigate={() => {}} />

      {/* Restart button at end */}
      {cursorState === 'restart' && (
        <button
          onClick={handleRestart}
          style={{
            position: 'fixed',
            bottom: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '25px',
            color: '#fff',
            fontFamily: 'Lato, sans-serif',
            fontStyle: 'italic',
            fontSize: '16px',
            cursor: 'pointer',
            zIndex: 100,
          }}
        >
          Restart Demo
        </button>
      )}

      {/* Dialogue container */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '0',
          transform: `translateX(-50%) translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`,
          transformOrigin: 'top center',
          width: '600px',
          height: '100%',
          padding: '40px 0',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {dialogues.map((dialogue, index) => (
          <div
            key={dialogue.id}
            style={{
              marginBottom: '60px',
              opacity: dialogue.state === 'hidden' ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
              display: dialogue.state === 'hidden' ? 'none' : 'block',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                flexDirection: dialogue.speaker === 'user' ? 'row' : 'row-reverse',
              }}
            >
              {/* Speaker icon */}
              <div
                style={{
                  flexShrink: 0,
                  color: getSpeakerColor(dialogue.state, dialogue.speaker),
                  transition: 'color 0.3s ease-in-out',
                  ...(dialogue.state === 'active' && dialogue.speaker === 'mentor' && {
                    filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))',
                  }),
                }}
              >
                {dialogue.speaker === 'user' ? <UserIcon /> : <MentorIcon />}
              </div>

              {/* Message content */}
              <div
                style={{
                  flex: 1,
                  maxWidth: '400px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    flexDirection: dialogue.speaker === 'user' ? 'row' : 'row-reverse',
                  }}
                >
                  {dialogue.important && (
                    <LightBulbIcon />
                  )}
                  {dialogue.state === 'typing' ? (
                    <Typewriter
                      text={dialogue.message}
                      onComplete={handleTypingComplete}
                      speed={dialogue.message.length > 50 ? 15 : 25}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: 'Lato, sans-serif',
                        fontStyle: 'italic',
                        fontSize: '16',
                        color: getSpeakerColor(dialogue.state, dialogue.speaker),
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {dialogue.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function getSpeakerColor(state: DialogueState, speaker: 'user' | 'mentor'): string {
  if (state === 'hidden') return 'transparent';
  if (state === 'completed') return '#666666';
  return '#FFFFFF';
}