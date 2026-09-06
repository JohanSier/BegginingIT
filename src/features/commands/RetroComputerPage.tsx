import { FormEvent, useState, useRef, useCallback, useEffect } from "react"
import { NavPill } from "../../components/NavPill"
import robotLogo from "../../imports/robot.svg"
import "./RetroComputerPage.css"

// Placeholder for OrangeStickyNote - user needs to provide this component
function OrangeStickyNote() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#ff9f32', borderRadius: '2px' }} />
  )
}

const bootLines = [
  "Welcome to Higginbotham! Is a pleasure having you here",
  "",
  "Booting up...",
  "",
  "Let's learn some commands and troubleshooting steps that for sure will help you in the near future",
  "",
  "Please type the option you want",
  "",
  "  A: Learn useful commands",
  "  B: Learn some IT troubleshooting steps",
]

export default function RetroComputerPage() {
  const [screenOn, setScreenOn] = useState(true)
  const [centralUnitOn, setCentralUnitOn] = useState(true)
  const [history, setHistory] = useState<string[]>([])
  const [command, setCommand] = useState("")
  const outputRef = useRef<HTMLDivElement>(null)

  // Drag functionality
  const [cam, setCam] = useState({ x: 0, y: 0, z: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const drag = useRef({ active: false, startX: 0, startY: 0, camX: 0, camY: 0 })
  const vel = useRef({ vx: 0, vy: 0, px: 0, py: 0, t: 0 })
  const raf = useRef<number | null>(null)

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  // Typewriter animation for boot lines
  useEffect(() => {
    if (!screenOn || !centralUnitOn) return

    let lineIndex = 0
    let charIndex = 0
    let currentLine = ""
    const lines: string[] = []

    const typeChar = () => {
      if (lineIndex >= bootLines.length) return

      const targetLine = bootLines[lineIndex]

      if (charIndex < targetLine.length) {
        currentLine += targetLine[charIndex]
        charIndex++
        lines[lineIndex] = currentLine
        setHistory([...lines])
        setTimeout(typeChar, 30) // Typing speed
      } else {
        lineIndex++
        charIndex = 0
        currentLine = ""
        lines[lineIndex] = ""
        setHistory([...lines])
        setTimeout(typeChar, 150) // Delay between lines
      }
    }

    // Start animation
    setHistory([""])
    setTimeout(typeChar, 500)

    return () => {
      // Cleanup if needed
    }
  }, [screenOn, centralUnitOn])

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
      z: cam.z,
    })
  }, [cam.z])

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
      setCam(c => ({ x: c.x + vx * 16, y: c.y + vy * 16, z: c.z }))
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => () => { if (raf.current !== null) cancelAnimationFrame(raf.current); }, [])

  const toggleScreen = () => {
    if (screenOn) {
      setHistory((lines) => [...lines, "Disconnecting..."])
      setScreenOn(false)
      return
    }

    setScreenOn(true)
    // Typewriter animation will handle setting history via useEffect
  }

  const toggleCentralUnit = () => {
    const nextState = !centralUnitOn
    setCentralUnitOn(nextState)
    if (!screenOn) return

    // Typewriter animation will handle setting history via useEffect
  }

  const submitCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!command.trim()) return
    
    if (command.toLowerCase() === 'clear') {
      setHistory([])
      setCommand("")
      return
    }
    
    setHistory((lines) => [...lines, `A> ${command}`, "Command not supported yet."])
    setCommand("")
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && event.key === 'l') {
      event.preventDefault()
      setHistory([])
    }
  }

  return (
    <main
      className="retro-page"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <NavPill active="commands" onNavigate={() => {}} />
      <div style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`, transition: isDragging ? "none" : "transform 0.1s ease-out" }}>
        <section className="retro-computer" aria-label="Interactive retro computer">
          <div className="center">
            <div className="screenBackground"><div className="behind" /></div>
            <div className="screenBox">
              <div className="frame">
                <div className={`screenBox2 ${screenOn ? "screenEffect" : ""}`}>
                  <div className="screenBox3">
                    <div className="screen">
                      {screenOn && (
                        <div className="output" ref={outputRef} tabIndex={0} role="log" aria-label="Computer terminal output">
                          {centralUnitOn ? (
                            <>
                              {history.map((line, index) => <div key={`${line}-${index}`}>{line || "\u00a0"}</div>)}
                              <form onSubmit={submitCommand} className="terminal-form">
                                <span>A&gt;&nbsp;</span>
                                <input 
                                  className="terminalInput" 
                                  value={command} 
                                  onChange={(event) => setCommand(event.target.value)} 
                                  onKeyDown={handleKeyDown}
                                  aria-label="Terminal command" 
                                  autoComplete="off" 
                                />
                              </form>
                            </>
                          ) : <div className="popup">NO SIGNAL</div>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bottomFrame">
                  <div className="fan" />
                  <img className="logo robot-logo" src={robotLogo} alt="BeginningIT robot logo" />
                  <button className="powerButton monitor-power" type="button" onClick={toggleScreen} aria-label="Toggle monitor power"><span className="powerIcon" /></button>
                  <span className={`powerLight ${screenOn ? "lightOn" : "lightOff"}`} />
                </div>
              </div>
            </div>
            <div className="screenFoot" />
            <div className="computer">
              <div className="computerFrame">
                <div className="computerFan1" /><div className="computerFan2" />
                <div className="screw1" /><div className="screw2" />
                <div className="computerFrame2"><div className="floppy"><div className="fingerGrip" /><div className="slot" /></div><div className="socket1" /><div className="socket2" /></div>
                <div className="screw3" /><div className="screw4" /><div className="screw5" />
                <div className="powerButton">
                  <div className="buttonSlide"><button className={`computerButton ${centralUnitOn ? "computerButtonOn" : "computerButtonOff"}`} type="button" onClick={toggleCentralUnit} aria-label="Toggle computer power" /></div>
                  <span className="offIndicator" /><span className="onIndicator" />
                </div>
                <span className={`powerLight ${centralUnitOn ? "lightOn" : "lightOff"}`} />
              </div>
            </div>
          </div>
          <aside className="retro-sticky-note" aria-label="When it might be useful">
            <div className="retro-sticky-note__art"><OrangeStickyNote /></div>
            <strong>When it might be useful:</strong>
          </aside>
        </section>
      </div>
    </main>
  )
}
