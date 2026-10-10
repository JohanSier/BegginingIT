import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'motion/react'

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS - Edit these to customize the preloader
// ═══════════════════════════════════════════════════════════════════════════════

const TITLE_TEXT = 'Begin in IT'
const SUBTITLE_TEXT = 'Welcome to the SOS Team'
const GOLD_ACCENT = '#f4c85a'
const BLACK_BACKGROUND = '#000000'

// Cell colors for the pixel grid (barely visible grain)
const CELL_COLORS = ['#000000', '#040406', '#07070a', '#0b0b0f']
const GOLD_DENSITY = 0.04 // share of cells that flash gold while dissolving
const MAX_CELLS = 450

// Timing. EVERY VALUE HERE IS IN MILLISECONDS (converted to seconds only where
// the motion library needs seconds, so you never have to think about units).
const FONT_LOAD_TIMEOUT = 1000
const TITLE_START_DELAY = 100
const TITLE_LETTER_STAGGER = 40
const TITLE_DURATION = 750
const SUBTITLE_START_DELAY = 450
const SUBTITLE_DURATION = 550
const TEXT_EXIT_START = 1450
const TEXT_EXIT_DURATION = 450
const TEXT_EXIT_STAGGER = 15
const DISSOLVE_START_DELAY = 1600 // the page mounts and the pixels start dissolving here
const DISSOLVE_DURATION = 350
const DISSOLVE_MAX_DELAY = 700
const REDUCED_MOTION_HOLD = 600

const SHOW_ONCE_PER_SESSION = false
const SESSION_KEY = 'appPreloaderShown'

// ═══════════════════════════════════════════════════════════════════════════════

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
const EASE_IN: [number, number, number, number] = [0.64, 0, 0.78, 0]

type Phase = 'fonts' | 'intro' | 'dissolve' | 'done'

interface Cell {
  id: number
  color: string
  delay: number
  gold: boolean
}

interface Grid {
  cols: number
  rows: number
  cells: Cell[]
}

// Built once on mount. Random values live here (never inside render).
function buildGrid(): Grid {
  const w = window.innerWidth
  const h = window.innerHeight
  let size = Math.max(40, Math.round(Math.max(w, h) / 24))
  let cols = Math.ceil(w / size)
  let rows = Math.ceil(h / size)
  while (cols * rows > MAX_CELLS) {
    size += 8
    cols = Math.ceil(w / size)
    rows = Math.ceil(h / size)
  }

  const cells: Cell[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const dx = (col + 0.5 - cols / 2) / (cols / 2)
      const dy = (row + 0.5 - rows / 2) / (rows / 2)
      const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy) / Math.SQRT2)
      cells.push({
        id: row * cols + col,
        color: CELL_COLORS[Math.floor(Math.random() * CELL_COLORS.length)],
        delay: Math.round((0.6 * Math.random() + 0.4 * dist) * DISSOLVE_MAX_DELAY),
        gold: Math.random() < GOLD_DENSITY,
      })
    }
  }
  return { cols, rows, cells }
}

const KEYFRAMES = `
@keyframes appPreloaderCell {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.4); }
}
@keyframes appPreloaderGold {
  0%   { opacity: 1; transform: scale(1); background-color: var(--cell-color); }
  25%  { opacity: 1; transform: scale(1); background-color: ${GOLD_ACCENT}; }
  100% { opacity: 0; transform: scale(0.4); background-color: ${GOLD_ACCENT}; }
}
`

const letterMaskStyle: CSSProperties = {
  display: 'inline-block',
  overflow: 'hidden',
  paddingBottom: '0.16em', // keeps the descender of the "g" from being clipped
  marginBottom: '-0.16em',
}

const titleRowStyle: CSSProperties = {
  display: 'flex',
  whiteSpace: 'nowrap',
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 400,
  fontSize: 'clamp(3rem, 9vw, 7rem)',
  letterSpacing: '-0.035em',
  lineHeight: 1,
  color: '#ffffff',
}

const subtitleStyle: CSSProperties = {
  margin: '14px 0 0',
  fontFamily: "'Lato', sans-serif",
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: 13,
  letterSpacing: '0.12em',
  color: 'rgba(255,255,255,0.45)',
}

export default function AppPreloader({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(() =>
    SHOW_ONCE_PER_SESSION && sessionStorage.getItem(SESSION_KEY) ? 'done' : 'fonts'
  )
  const [textExit, setTextExit] = useState(false)
  const [reduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  )
  const grid = useMemo(() => (reduced ? null : buildGrid()), [reduced])

  // 1) Wait for the fonts (capped) so the title never flashes in a fallback font
  useEffect(() => {
    if (phase !== 'fonts') return
    let cancelled = false
    const go = () => {
      if (!cancelled) setPhase('intro')
    }
    const timeout = window.setTimeout(go, FONT_LOAD_TIMEOUT)
    const fonts = document.fonts
    if (fonts?.load) {
      Promise.all([
        fonts.load('400 1em "Bricolage Grotesque"'),
        fonts.load('italic 400 1em "Lato"'),
      ])
        .then(() => fonts.ready)
        .then(go, go)
    } else {
      go()
    }
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [phase])

  // 2) Intro: text plays, then the dissolve begins
  useEffect(() => {
    if (phase !== 'intro') return
    if (SHOW_ONCE_PER_SESSION) sessionStorage.setItem(SESSION_KEY, 'true')
    const timers: number[] = []
    if (!reduced) timers.push(window.setTimeout(() => setTextExit(true), TEXT_EXIT_START))
    timers.push(
      window.setTimeout(
        () => setPhase('dissolve'),
        reduced ? REDUCED_MOTION_HOLD : DISSOLVE_START_DELAY
      )
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [phase, reduced])

  // 3) Dissolve: remove the overlay once the last cell is gone
  useEffect(() => {
    if (phase !== 'dissolve') return
    const total = reduced ? 350 : DISSOLVE_MAX_DELAY + DISSOLVE_DURATION + 120
    const timer = window.setTimeout(() => setPhase('done'), total)
    return () => window.clearTimeout(timer)
  }, [phase, reduced])

  const dissolving = phase === 'dissolve'

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 100000,
    overflow: 'hidden',
    pointerEvents: dissolving ? 'none' : 'auto',
    // The pixel cells ARE the black background, so when they dissolve the page shows through.
    backgroundColor: dissolving && !reduced ? 'transparent' : BLACK_BACKGROUND,
    opacity: dissolving && reduced ? 0 : 1,
    transition: reduced ? 'opacity 300ms ease' : undefined,
  }

  return (
    <>
      {phase !== 'done' && (
        <div
          style={overlayStyle}
          role="status"
          aria-live="polite"
          aria-label={`Loading ${TITLE_TEXT}`}
        >
          <style>{KEYFRAMES}</style>

          {/* Pixel grid (rendered from the very first frame so the screen is black immediately) */}
          {grid && (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
              }}
            >
              {grid.cells.map((cell) => {
                const style = {
                  backgroundColor: cell.color,
                  margin: '-0.5px', // overlap neighbours so no hairline seams show through
                  '--cell-color': cell.color,
                  ...(dissolving
                    ? {
                        animation: `${cell.gold ? 'appPreloaderGold' : 'appPreloaderCell'} ${DISSOLVE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) ${cell.delay}ms forwards`,
                        willChange: 'transform, opacity',
                      }
                    : null),
                } as CSSProperties
                return <div key={cell.id} style={style} />
              })}
            </div>
          )}

          {/* Text (only starts once the fonts are ready) */}
          {phase !== 'fonts' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div style={titleRowStyle}>
                {Array.from(TITLE_TEXT).map((char, i) => (
                  <span key={i} aria-hidden style={letterMaskStyle}>
                    <motion.span
                      style={{ display: 'inline-block' }}
                      initial={reduced ? false : { y: '110%' }}
                      animate={{ y: textExit ? '-110%' : '0%' }}
                      transition={
                        textExit
                          ? {
                              delay: (i * TEXT_EXIT_STAGGER) / 1000,
                              duration: TEXT_EXIT_DURATION / 1000,
                              ease: EASE_IN,
                            }
                          : {
                              delay: (TITLE_START_DELAY + i * TITLE_LETTER_STAGGER) / 1000,
                              duration: TITLE_DURATION / 1000,
                              ease: EASE_OUT,
                            }
                      }
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  </span>
                ))}
              </div>

              <motion.p
                style={subtitleStyle}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={textExit ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
                transition={
                  textExit
                    ? { duration: 0.3, ease: EASE_IN }
                    : {
                        delay: SUBTITLE_START_DELAY / 1000,
                        duration: SUBTITLE_DURATION / 1000,
                        ease: EASE_OUT,
                      }
                }
              >
                {SUBTITLE_TEXT}
              </motion.p>
            </div>
          )}
        </div>
      )}

      {/* The page mounts exactly when the dissolve begins, and is never remounted afterwards */}
      {(phase === 'dissolve' || phase === 'done') && children}
    </>
  )
}