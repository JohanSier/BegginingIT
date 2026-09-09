import { FormEvent, useState, useRef, useCallback, useEffect } from "react"
import { NavPill } from "../../components/NavPill"
import robotLogo from "../../imports/robotIbmStyle.svg"
import OrangeStickyNote from "../../imports/OrangeStickyNote"
import "./RetroComputerPage.css"

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

const menuLines = [
  "Please type the option you want",
  "",
  "  A: Learn useful commands",
  "  B: Learn some IT troubleshooting steps",
]

const troubleshootingSteps = {
  1: {
    title: "Shared Folder Access Denied",
    steps: [
      "Check network.",
      "Verify user group.",
      "Check server availability.",
      "Test with another account."
    ]
  },
  2: {
    title: "Wi-Fi Not Connecting",
    steps: [
      "Turn Wi-Fi ON.",
      "Restart adapter.",
      "Forget and reconnect network.",
      "Update Wi-Fi driver.",
      "Restart router.",
      "Test another device."
    ]
  },
  3: {
    title: "Outlook Not Working",
    steps: [
      "Check Internet.",
      "Restart mailbox size.",
      "Repair Outlook profile.",
      "Test webmail.",
      "Verify mail server."
    ]
  },
  4: {
    title: "Forgot Windows Password",
    steps: [
      "Do Caller Verify.",
      "Reset password in EntraID.",
      "Ask user to create a new password.",
      "Criteria is min 12 characters, 1 capital letter and a Symbol",
      "Sign out and sign in again to confirm login works."
    ]
  },
  5: {
    title: "Computer Not Turning On",
    steps: [
      "Check power cable.",
      "Check power outlet.",
      "Check SMPS / charger.",
      "Remove external devices.",
      "Restart the PC.",
      "If still not working, check hardware and escalate."
    ]
  },
  6: {
    title: "No Internet Connection",
    steps: [
      "Check network cable / Wi-Fi.",
      "Run ipconfig.",
      "Ping gateway.",
      "Ping Google (8.8.8.8).",
      "Restart network adapter.",
      "Restart router.",
      "Contact network team if needed."
    ]
  },
  7: {
    title: "Printer Not Printing",
    steps: [
      "Check power.",
      "Check USB / Network cable.",
      "Check paper and toner.",
      "Clear printer Spooler.",
      "Reinstall printer driver."
    ]
  },
  8: {
    title: "Computer Running Slow Hanging / Freezing",
    steps: [
      "Wait a few seconds.",
      "Press Ctrl + Shift + Esc.",
      "End frozen application & Restart PC.",
      "Check Event Viewer.",
      "Check CPU, RAM, Disk usage in Task Manager.",
      "Check Event Viewer for errors.",
      "Close unnecessary applications.",
      "Disable unnecessary startup apps.",
      "Run a virus/malware scan.",
      "Check available disk space.",
      "Check Windows updates.",
      "Restart computer.",
      "Upgrade RAM / SSD if needed."
    ]
  },
  9: {
    title: "Blue Screen (BSOD)",
    steps: [
      "Note error code.",
      "Boot into Safe Mode.",
      "Update drivers.",
      "Run sfc /scannow.",
      "Check RAM and hard disk.",
      "Restore Windows if needed."
    ]
  }
}

const usefulCommands = {
  basic: [
    { command: "dir", description: "List files and directories" },
    { command: "cd", description: "Change directory" },
    { command: "cls", description: "Clear screen" },
    { command: "ipconfig", description: "Display network configuration" },
    { command: "ping", description: "Test network connectivity" }
  ],
  advanced: [
    { command: "netstat", description: "Display network connections" },
    { command: "tasklist", description: "Display running processes" },
    { command: "eventvwr", description: "Event viewer" }
  ],
  office: [
    { command: "outlook.exe /safe", description: "Launch Outlook with add-ins disabled" },
    { command: "outlook.exe /cleanreminders", description: "Clear calendar reminder database" },
    { command: "excel.exe /safe", description: "Open Excel without add-ins" },
    { command: "outlook.exe /resetnavpane", description: "Reset Outlook navigation pane" }
  ],
  system: [
    { command: "taskkill /F /IM Acrobat.exe", description: "Force terminate Adobe Acrobat" },
    { command: "control /name Microsoft.DefaultPrograms", description: "File association settings" },
    { command: "explorer %temp%", description: "Open temporary files folder" },
    { command: "chkdsk /f", description: "Scan and fix disk errors" },
    { command: "chkdsk /?", description: "Display chkdsk help menu" },
    { command: "sfc /scannow", description: "System File Checker" },
    { command: "DISM /Online /Cleanup-Image /ScanHealth", description: "Check system image corruption" }
  ]
}

interface CommandDetail {
  whatItDoes: string
  useCase: string
  whyItMatters: string
}

const commandDetails: Record<string, CommandDetail> = {
  "outlook.exe /safe": {
    whatItDoes: "Launches Outlook with all third-party add-ins, macros, and toolbar customizations disabled.",
    useCase: "Outlook crashes on startup, hangs on the splash screen, or freezes while opening emails.",
    whyItMatters: "Instantly isolates whether a bad add-in (like Teams, Zoom, or antivirus plugins) is causing the crash."
  },
  "outlook.exe /cleanreminders": {
    whatItDoes: "Clears and regenerates the local calendar reminder database.",
    useCase: "Calendar notifications loop endlessly, refuse to dismiss, or freeze Outlook when triggering.",
    whyItMatters: "Fixes stuck notification loops without deleting or modifying calendar events."
  },
  "excel.exe /safe": {
    whatItDoes: "Opens Microsoft Excel without loading startup templates, add-ins, or personal macro workbooks (PERSONAL.XLSB).",
    useCase: "Excel crashes immediately upon launch or hangs when opening specific spreadsheets.",
    whyItMatters: "Quickly determines if corrupt add-ins or personal macro files are breaking the application."
  },
  "taskkill /F /IM Acrobat.exe": {
    whatItDoes: "Forcefully terminates all invisible, hung background processes of Adobe Acrobat (use AcroRd32.exe for Adobe Reader).",
    useCase: "User double-clicks a PDF, nothing opens, and Adobe reports 'an instance is already running.'",
    whyItMatters: "Adobe frequently leaves ghost background processes running that block new PDF documents from rendering."
  },
  "control /name Microsoft.DefaultPrograms": {
    whatItDoes: "Direct control panel shortcut to file association and default app settings.",
    useCase: "PDFs suddenly opening in Microsoft Edge instead of Adobe Acrobat, or web links refusing to launch Outlook.",
    whyItMatters: "Bypasses complex Windows Settings sub-menus to fix broken file type handlers directly."
  },
  "explorer %temp%": {
    whatItDoes: "Opens the logged-in user's temporary files folder in File Explorer.",
    useCase: "Clearing corrupt cache files when Adobe, Office apps, or browsers fail to launch or crash randomly.",
    whyItMatters: "Skips manual navigation through hidden AppData pathways so techs can purge bad cached files fast."
  },
  "chkdsk /f": {
    whatItDoes: "Scans the hard drive file system for logical errors and automatically fixes them.",
    useCase: "Fixing file corruption warnings, unreadable drive sectors, or disk error alerts on boot.",
    whyItMatters: "Prevents file system damage from spreading. Note: Running it on the primary OS drive (C:) requires a system restart."
  },
  "chkdsk /?": {
    whatItDoes: "Displays the official help menu and full list of switch parameters for the chkdsk utility.",
    useCase: "Checking available diagnostic flags (such as /r to locate and repair bad physical sectors).",
    whyItMatters: "Teaches Tier 1 techs how to self-serve parameter syntax directly inside the terminal."
  },
  "sfc /scannow": {
    whatItDoes: "Scans protected Windows core files and replaces corrupted, modified, or missing files using a clean cached copy.",
    useCase: "Resolving random Windows crashes, missing .dll errors, or broken Start Menu/Taskbar functions.",
    whyItMatters: "The universal first-line fix for mysterious OS glitches before considering a full system re-image."
  },
  "DISM /Online /Cleanup-Image /ScanHealth": {
    whatItDoes: "Checks the local Windows Component Store (WinSxS folder) for system image corruption.",
    useCase: "Running a diagnostic check when sfc /scannow fails, freezes, or reports that it found errors it could not fix.",
    whyItMatters: "SFC relies on a clean component store to pull repair files from. If SFC is broken, DISM identifies if the local store itself is damaged (paired with /RestoreHealth to download healthy files)."
  },
  "outlook.exe /resetnavpane": {
    whatItDoes: "Clears and regenerates the navigation pane settings file (.xml) for the current Outlook profile, resetting the left sidebar (folders, shortcuts, calendars) to factory defaults.",
    useCase: "Outlook freezing on the 'Loading Profile...' splash screen, crashing instantly upon launch, or displaying a missing/corrupted left navigation bar.",
    whyItMatters: "Fixes 90% of Outlook startup crashes instantly without forcing the tech to rebuild the user's entire mail profile or reinstall Microsoft Office."
  }
}

// Function to split text into chunks of max 80 words, preserving newlines
function splitTextIntoChunks(text: string, maxWords: number = 80): string[] {
  // Split into tokens, keeping newline runs as their own tokens instead of discarding them
  const tokens = text.split(/(\n+)/).flatMap((part) =>
    /^\n+$/.test(part) ? [part] : part.split(/ +/)
  ).filter((token) => token !== '')

  const chunks: string[] = []
  let current: string[] = []
  let wordCount = 0

  for (const token of tokens) {
    const isNewline = /^\n+$/.test(token)
    current.push(token)
    if (!isNewline) wordCount++

    if (wordCount >= maxWords) {
      chunks.push(current.join(' ').replace(/ (\n+) /g, '$1'))
      current = []
      wordCount = 0
    }
  }
  if (current.length > 0) {
    chunks.push(current.join(' ').replace(/ (\n+) /g, '$1'))
  }

  return chunks
}

// Function to calculate sticky note positions
function getStickyNotePositions(index: number) {
  // First sticky note on left, second on right, alternate for additional notes
  // First two sticky notes have same height, from third onwards they stack vertically
  const verticalOffset = index < 2 ? 0 : (index - 1) * 250
  const isEven = index % 2 === 0

  return {
    top: 10 + verticalOffset,
    left: isEven ? 'calc(-100% + 200px)' : 'calc(100% + 34px)'
  }
}

export default function RetroComputerPage() {
  const [screenOn, setScreenOn] = useState(false)
  const [centralUnitOn, setCentralUnitOn] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [command, setCommand] = useState("")
  const [showTurnOnMessage, setShowTurnOnMessage] = useState(true)
  const [showSkipMessage, setShowSkipMessage] = useState(false)
  const [currentMode, setCurrentMode] = useState<"menu" | "troubleshooting" | "commands">("menu")
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null)
  const [notesVisible, setNotesVisible] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const bootTimeoutRef = useRef<number | null>(null)

  // Generate sticky note content based on selected command
  const stickyNoteContent = selectedCommand && commandDetails[selectedCommand]
    ? `What it does: ${commandDetails[selectedCommand].whatItDoes}\n\nUse Case: ${commandDetails[selectedCommand].useCase}\n\nWhy it matters: ${commandDetails[selectedCommand].whyItMatters}`
    : ""

  // Split sticky note content into chunks
  const stickyNoteChunks = splitTextIntoChunks(stickyNoteContent, 80)

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

    // Reset mode when both are turned on
    setCurrentMode("menu")

    // Show skip message when boot starts
    setShowSkipMessage(true)

    let lineIndex = 0
    let charIndex = 0
    let currentLine = ""
    const lines: string[] = []

    const typeChar = () => {
      if (lineIndex >= bootLines.length) {
        setShowSkipMessage(false)
        return
      }

      const targetLine = bootLines[lineIndex]

      if (charIndex < targetLine.length) {
        currentLine += targetLine[charIndex]
        charIndex++
        lines[lineIndex] = currentLine
        setHistory([...lines])
        bootTimeoutRef.current = setTimeout(typeChar, 30) // Typing speed
      } else {
        lineIndex++
        charIndex = 0
        currentLine = ""
        lines[lineIndex] = ""
        setHistory([...lines])
        bootTimeoutRef.current = setTimeout(typeChar, 150) // Delay between lines
      }
    }

    // Start animation
    setHistory([""])
    bootTimeoutRef.current = setTimeout(typeChar, 500)

    return () => {
      if (bootTimeoutRef.current) {
        clearTimeout(bootTimeoutRef.current)
      }
    }
  }, [screenOn, centralUnitOn])

  // Handle turn on message appearing/disappearing and mode reset
  useEffect(() => {
    if (screenOn || centralUnitOn) {
      setShowTurnOnMessage(false)
    } else {
      setShowTurnOnMessage(true)
      setCurrentMode("menu")
      setSelectedCommand(null)
      setNotesVisible(false)
      setShowSkipMessage(false)
    }
  }, [screenOn, centralUnitOn])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.closest("button, a, input, [data-no-drag]")) return

    // Don't start drag if we're in skip mode (user might want to click to skip)
    if (showSkipMessage) return

    if (raf.current !== null) { cancelAnimationFrame(raf.current); raf.current = null }

    drag.current = { active: true, startX: e.clientX, startY: e.clientY, camX: cam.x, camY: cam.y }
    vel.current = { vx: 0, vy: 0, px: e.clientX, py: e.clientY, t: performance.now() }

    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [cam.x, cam.y, showSkipMessage])

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

    const normalized = command.trim().toLowerCase()
    const originalCommand = command.trim()

    if (normalized === 'clear') {
      setHistory([])
      setCommand("")
      return
    }

    if (normalized === 'menu') {
      setCurrentMode("menu")
      setSelectedCommand(null)
      setNotesVisible(false)
      setHistory((lines) => [...lines, `A> ${originalCommand}`, "", ...menuLines])
      setCommand("")
      return
    }

    if (currentMode === "menu") {
      if (normalized === 'a') {
        setCurrentMode("commands")
        const commandLines = [
          "A> " + originalCommand,
          "",
          "=== USEFUL COMMANDS ===",
          "",
          "BASIC COMMANDS:",
          ...usefulCommands.basic.map(cmd => `  ${cmd.command.padEnd(30)} - ${cmd.description}`),
          "",
          "ADVANCED COMMANDS:",
          ...usefulCommands.advanced.map(cmd => `  ${cmd.command.padEnd(30)} - ${cmd.description}`),
          "",
          "OFFICE COMMANDS:",
          ...usefulCommands.office.map(cmd => `  ${cmd.command.padEnd(30)} - ${cmd.description}`),
          "",
          "SYSTEM COMMANDS:",
          ...usefulCommands.system.map(cmd => `  ${cmd.command.padEnd(30)} - ${cmd.description}`),
          "",
          "Type a command to see details, or 'menu' to return"
        ]
        setHistory((lines) => [...lines, ...commandLines])
        setCommand("")
        return
      }

      if (normalized === 'b') {
        setCurrentMode("troubleshooting")
        const troubleshootingMenu = [
          "A> " + originalCommand,
          "",
          "=== TROUBLESHOOTING STEPS ===",
          "",
          ...Object.entries(troubleshootingSteps).map(([num, step]) =>
            `  ${num}. ${step.title}`
          ),
          "",
          "Type a number (1-9) to view steps, or 'menu' to return"
        ]
        setHistory((lines) => [...lines, ...troubleshootingMenu])
        setCommand("")
        return
      }

      setHistory((lines) => [...lines, `A> ${originalCommand}`, "Invalid option. Please type 'A' or 'B'."])
      setCommand("")
      return
    }

    if (currentMode === "troubleshooting") {
      const stepNumber = parseInt(originalCommand)

      if (troubleshootingSteps[stepNumber as keyof typeof troubleshootingSteps]) {
        const step = troubleshootingSteps[stepNumber as keyof typeof troubleshootingSteps]
        const stepLines = [
          "A> " + originalCommand,
          "",
          `=== ${step.title} ===`,
          "",
          ...step.steps.map((s, i) => `  ${i + 1}. ${s}`),
          "",
          "Type 'menu' to return to main menu"
        ]
        setHistory((lines) => [...lines, ...stepLines])
        setCommand("")
        return
      }

      setHistory((lines) => [...lines, `A> ${originalCommand}`, "Invalid option. Please type a number (1-9) or 'menu'."])
      setCommand("")
      return
    }

    if (currentMode === "commands") {
      // Check if the command has detailed information
      if (commandDetails[originalCommand]) {
        setSelectedCommand(originalCommand)
        setNotesVisible(true)
        const cmdDetail = commandDetails[originalCommand]
        const responseLines = [
          "A> " + originalCommand,
          "",
          `What it does: ${cmdDetail.whatItDoes}`,
          "",
          "Type 'menu' to return to main menu"
        ]
        setHistory((lines) => [...lines, ...responseLines])
      } else {
        setHistory((lines) => [...lines, `A> ${originalCommand}`, "Type 'menu' to return to main menu"])
      }
      setCommand("")
      return
    }

    setHistory((lines) => [...lines, `A> ${originalCommand}`, "Command not supported."])
    setCommand("")
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey && event.key === 'l') {
      event.preventDefault()
      setHistory([])
    }
  }

  const skipBootAnimation = () => {
    if (bootTimeoutRef.current) {
      clearTimeout(bootTimeoutRef.current)
    }
    setShowSkipMessage(false)
    setHistory(bootLines)
  }

  const handlePageClick = (e: React.MouseEvent) => {
    // Only skip if the skip message is showing and we're not clicking on interactive elements
    const target = e.target as HTMLElement
    if (showSkipMessage && !target.closest('button, input, [data-no-skip]')) {
      skipBootAnimation()
    }
  }

  return (
    <main
      className="retro-page"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={handlePageClick}
      style={{ cursor: showSkipMessage ? "pointer" : (isDragging ? "grabbing" : "grab") }}
    >
      <NavPill active="commands" onNavigate={() => { }} />
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
          {showTurnOnMessage && !screenOn && !centralUnitOn && (
            <div className="turn-on-message">Turn the Computer On!</div>
          )}
          {showSkipMessage && screenOn && centralUnitOn && (
            <div className="skip-message" onClick={skipBootAnimation}>Skip Boot Animation</div>
          )}
          {notesVisible && stickyNoteChunks.map((chunk, index) => {
            const position = getStickyNotePositions(index)
            return (
              <aside
                key={index}
                className="retro-sticky-note retro-sticky-note--enter"
                aria-label={`Sticky note ${index + 1}`}
                style={{ top: position.top, left: position.left, animationDelay: `${index * 0.15}s` }}
              >
                <div className="retro-sticky-note__art retro-sticky-note__art--top"><OrangeStickyNote /></div>
                <div className="retro-sticky-note__art retro-sticky-note__art--bottom" aria-hidden="true"><OrangeStickyNote /></div>
                <strong>Command Details:</strong>
                <p>{chunk}</p>
              </aside>
            )
          })}
        </section>
      </div>
    </main>
  )
}
