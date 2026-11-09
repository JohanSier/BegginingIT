import { useState, useCallback, useEffect } from "react"

interface CenterViewButtonProps {
  cam: { x: number; y: number; z: number }
  onCenter: (newCam: { x: number; y: number; z: number }) => void
  containerWidth?: number
  containerHeight?: number
}

export function CenterViewButton({ cam, onCenter, containerWidth = 1400, containerHeight = 1200 }: CenterViewButtonProps) {
  const [showCenterButton, setShowCenterButton] = useState(false)

  const centerView = useCallback(() => {
    const screenWidth = window.innerWidth
    const topOffset = 120
    onCenter({
      x: Math.round((screenWidth - containerWidth) / 2),
      y: Math.round(topOffset - 100),
      z: 1,
    })
    setShowCenterButton(false)
  }, [onCenter, containerWidth])

  // Check if content is visible on mount and after resize
  useEffect(() => {
    const checkVisibility = () => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const containerLeft = cam.x
      const containerRight = cam.x + containerWidth
      const containerTop = cam.y
      const containerBottom = cam.y + containerHeight

      const isVisible = containerRight > 0 && containerLeft < screenWidth && containerBottom > 0 && containerTop < screenHeight
      setShowCenterButton(!isVisible)
    }

    checkVisibility()
    window.addEventListener('resize', checkVisibility)
    return () => window.removeEventListener('resize', checkVisibility)
  }, [cam, containerWidth, containerHeight])

  return (
    <>
      {showCenterButton && (
        <button
          onClick={centerView}
          className="center-view-button"
          style={{
            position: 'fixed',
            bottom: 170,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50px',
            padding: '12px 24px',
            color: '#fff',
            fontFamily: "'Lato', sans-serif",
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
          }}
        >
          Center View
        </button>
      )}
    </>
  )
}
