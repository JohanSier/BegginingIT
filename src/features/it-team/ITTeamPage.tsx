import { useState, useRef, useCallback, useEffect } from "react"
import { NavPill } from "../../components/NavPill"
import { Blobatar } from "@blobatar/react"
import { itTeam, platforms } from "./data/itTeam"
import "./ITTeamPage.css"

// Custom component for distance-based eye tracking
function SmartBlobatar({ name, size }: { name: string; size: number }) {
  const [isClose, setIsClose] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + 
      Math.pow(e.clientY - centerY, 2)
    )
    
    // Only track eyes if mouse is within 200px
    setIsClose(distance < 200)
  }

  const handleMouseLeave = () => {
    setIsClose(false)
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block' }}
    >
      <Blobatar 
        name={name} 
        animate={isClose ? "hover" : "none"}
        size={size}
      />
    </div>
  )
}

export default function ITTeamPage() {
  const [cam, setCam] = useState(() => {
    if (typeof window === "undefined") return { x: 0, y: 0, z: 1 }
    // Center the content initially
    const screenWidth = window.innerWidth
    const containerWidth = 1400 // max-width of container
    const screenHeight = window.innerHeight
    const estimatedContentHeight = 2000 // approximate height of all platforms
    
    return {
      x: Math.round((screenWidth - containerWidth) / 2),
      y: Math.round((screenHeight - estimatedContentHeight) / 2),
      z: 1,
    }
  })
  const [isDragging, setIsDragging] = useState(false)
  const drag = useRef({ active: false, startX: 0, startY: 0, camX: 0, camY: 0 })
  const vel = useRef({ vx: 0, vy: 0, px: 0, py: 0, t: 0 })
  const raf = useRef<number | null>(null)

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.closest("button, a, input, [data-no-drag]")) return

    if (raf.current !== null) { cancelAnimationFrame(raf.current); raf.current = null }

    drag.current = { active: true, startX: e.clientX, startY: e.clientY, camX: cam.x, camY: cam.y }
    vel.current = { vx: 0, vy: 0, px: e.clientX, py: e.clientY, t: performance.now() }

    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [cam.x, cam.y])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return

    const now = performance.now()
    const dt = now - vel.current.t
    if (dt > 0) {
      vel.current.vx = (e.clientX - vel.current.px) / dt
      vel.current.vy = (e.clientY - vel.current.py) / dt
      vel.current.px = e.clientX
      vel.current.py = e.clientY
      vel.current.t = now
    }

    setCam({
      x: drag.current.camX + (e.clientX - drag.current.startX),
      y: drag.current.camY + (e.clientY - drag.current.startY),
      z: 1,
    })
  }, [])

  const onPointerUp = useCallback(() => {
    if (!drag.current.active) return
    drag.current.active = false
    setIsDragging(false)

    let { vx, vy } = vel.current
    const FRICTION = 0.88

    function step() {
      vx *= FRICTION
      vy *= FRICTION
      if (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05) { raf.current = null; return }
      setCam(c => ({ x: c.x + vx * 16, y: c.y + vy * 16, z: 1 }))
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => () => { if (raf.current !== null) cancelAnimationFrame(raf.current); }, [])

  return (
    <>
      <NavPill active="it-team" onNavigate={() => {}} />

      <div 
        className="it-team-page"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div 
          className="it-team-container"
          style={{ 
            transform: `translate(${cam.x}px, ${cam.y}px)`,
            transition: isDragging ? "none" : "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
            transformOrigin: "0 0"
          }}
        >
        {platforms.map((platform) => {
          const platformMembers = itTeam.filter(member => member.platform === platform.key)
          
          if (platformMembers.length === 0) return null
          
          return (
            <div key={platform.key} className="platform-section">
              <div 
                className="platform-blob"
                style={{
                  // Calculate blob size based on number of members
                  width: `${Math.min(100, 60 + platformMembers.length * 4)}%`,
                  maxWidth: `${Math.min(900, 400 + platformMembers.length * 30)}px`,
                }}
              >
                <div className="platform-label">{platform.label}</div>
                <div className="platform-members">
                  {platformMembers.map((member) => {
                    // Generate a more random animation delay based on the name
                    const nameSum = member.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
                    const randomDelay = (nameSum % 30) / 10 // Random delay between 0-3s
                    
                    return (
                      <div 
                        key={member.name} 
                        className="member-card"
                        style={{
                          animationDelay: `${randomDelay}s`,
                        }}
                      >
                        <SmartBlobatar 
                          name={member.name} 
                          size={64}
                        />
                        <div className="member-info">
                          <div className="member-name">{member.name}</div>
                          <div className="member-role">{member.role}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
        </div>
      </div>
    </>
  )
}