import svgPaths from '../../../imports/Frame/svg-xgf2o1h7f8'

interface CustomCursorProps {
  x: number
  y: number
  state: 'reading' | 'ready' | 'restart'
  visible: boolean
}

export default function CustomCursor({ x, y, state, visible }: CustomCursorProps) {
  if (!visible) return null

  const isReady = state === 'ready' || state === 'restart'

  return (
    <>
      {/* Pulsing ring — expands from the icon when ready */}
      {isReady && (
        <div
          style={{
            position: 'fixed',
            left: x,
            top: y,
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.5)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9998,
            animation: 'cursorPulse 1.3s ease-out infinite',
          }}
        />
      )}

      {/* Circle-arrow icon */}
      <div
        style={{
          position: 'fixed',
          left: x,
          top: y,
          width: 24,
          height: 24,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isReady ? 1 : 0.28,
          filter: isReady ? 'drop-shadow(0 0 6px rgba(255,255,255,0.45))' : 'none',
          transition: 'opacity 0.35s ease, filter 0.35s ease',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: 'block' }}
        >
          <path d={svgPaths.p71ef900} />
        </svg>
      </div>
    </>
  )
}