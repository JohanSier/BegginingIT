import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react"
import { NavPill } from "../../components/NavPill"

type Template = { title: string; body: string }
type Category = { title: string; templates: Template[] }

const categories: Category[] = [
  {
    title: "Greetings",
    templates: [
      { title: "Thanks for contacting I", body: "Hello [User],\n\nThanks for contacting SOS. I’ll contact you shortly.\n\n" },
      { title: "Thanks for contacting II", body: "Hello [User],\n\nI’ll contact you right away.\n\n" },
      { title: "Tried to reach out", body: "Hello [User],\n\nI just tried reaching out to your number ending in [Last 4 numbers]. Please, do not call the queue, but rather, let me know on this ticket when you are available and I will reach out.\n\nThank You\n\n" },
    ],
  },
  {
    title: "Ticket Updates/Follow Up",
    templates: [
      { title: "Third Party Response", body: "Hi [User],\n\nI hope you’re doing well. May I ask if you received any response from [Third Party]?\n\nPlease let me know!\n\n" },
      { title: "Reaching out to Pending Tickets", body: "Hi [User],\n\nI'm reaching out again just to make sure if the issue is still happening. If so, let me know when you're available so we can check it out!\n\n" },
      { title: "Still Investigating", body: "Hi [User],\n\nWe're still looking into this and wanted to keep you in the loop. I'll send another update shortly.\n\n" },
      { title: "Resolved", body: "Hi [User],\n\nThis is now resolved. Please try again when you have a moment, and let me know if anything still feels off.\n\n" },
    ],
  },
  {
    title: "Escalations",
    templates: [
      { title: "Case is being escalated", body: "Hi [User],\n\nAs I mentioned in the call, this case is being escalated to our tier 2 team, and a member of that team will be reaching out to you directly.\n\nThank you, and I hope you have a great day!\n\n" },
      { title: "Escalating Directly to T2 in", body: "Hi [Name],\n\nThank you for reaching out to us. I appreciate you bringing this matter to our attention.\n\nTo ensure your request is handled as efficiently and thoroughly as possible, I will be escalating your case to our Tier 2 support team for further review. They have the appropriate resources to take a closer look and provide you with the assistance you need. \n\nA member of the Tier 2 team will be reaching out to you shortly to continue working with you directly and provide updates on your case. \n\nThank you!\n\n" },
    ],
  },
  {
    title: "Asking for Approval",
    templates: [
      { title: "Add to Distro Group", body: "Hi [Manager],\n\nI hope all is well.\n\nCould you please confirm if we can proceed with adding [User] to the group labeled [Group Name]?\n\nThank you in advance for your help.\n\n" },
      { title: "MFA Reset Approval", body: "Hi [Manager],\n\nThis is [You] from the SOS team. [User] recently switched phones and his MFA is no longer working. May I get your approval to reset his MFA so he can enroll a new device?\n\nThanks\n\n" },
    ],
  },
  {
    title: "Give Email Access to Coworker",
    templates: [
      { title: "Tell user you have to ask their Manager", body: "Hi [User],\n\nThanks for reaching out\n\nBefore moving forward, I'd like to check with your manager first. Since this falls under company policy, I would appreciate having written approval from your manager so we can ensure everything is properly documented!\n\nOnce I receive that confirmation, I'll give you access to [Other User]'s email!\n\n" },
      { title: "Asking their Manager", body: "Hi [User's Manager],\n\nI hope you're doing well.\n\nI wanted to reach out regarding a request from [User]\n\n Would you please let me know if you approve granting [User] access to [Other User]'s email account?\n\nThank you for your time\n\n" },
      { title: "After Manager granted Access", body: "Thanks for the quick answer [User's Manager]!\n\n [User], I've granted you access to [Other User]'s email account. Changes can take some time to synchronize, typically 1 hour.\n\n Let me know if you have access then! \n\n" },
    ],
  },
  {
    title: "Closing",
    templates: [
      { title: "Close Ticket", body: "Hi [User],\n\nI’m glad we were able to get everything resolved successfully. I'll go ahead and close this ticket now, but If anything else comes up in the future, don’t hesitate to submit a new ticket. Our team will always be here to assist you \n\nEnjoy the rest of your day!\n\n" },
      { title: "It was a pleasure I", body: "It was a pleasure assisting you today, [USER]!\n\nI’m glad everything was resolved successfully. If you need help with anything else in the future, please feel free to submit another ticket, we’ll be happy to assist.\n\n Enjoy the rest of your day\n\n" },
      { title: "It was a pleasure II", body: "Hi [User],\n\nIt was a pleasure assisting you today!\n\nI’m glad we were able to get everything resolved successfully. If you need any further assistance with the [Issue], please feel free to reply to this same email thread, even if it has been 'Solved', it will automatically reopen, and I’ll be happy to help.\n\nIf anything else comes up in the future, don’t hesitate to submit a new ticket. Our team will always be here to assist you.\n\n Wishing you a lovely rest of your day!\n\n" },
    ],
  },
  {
    title: "Report Email as Phishing",
    templates: [
      { title: "Report it as Phishing I", body: "Hey [User],\n\nRemember, if you're unsure and suspect that an email is a phishing attempt or spam, please use the Report button at the top ribbon in Outlook or right-click on the email > Report > Report Phishing to report this and it will be sent to our designated team to investigate its legitimacy.\n\nYou should never forward a suspicious email to anyone, that includes SOS\n\n Thank you\n\n" },
      { title: "Report it as Phishing II", body: "Hello [User],\n\nThanks for contacting SOS. For these kinds of emails, we will need to report them using the phishing button on our Outlook Desktop App.\n\nFor that we will do the following:\n\nRight click on the suspicious email.\nSelect the option for 'Report'.\nSelect 'Report Phishing'.\n\nBy reporting this, our cybersecurity team will let you know if you can trust or no the email and also the sender.\n\nThis will send it to your deleted folder and can be recovered if you get the confirmation it is safe.\n\nLet me know if there are any questions.\n\nHave a great rest of your day! \n\n" },
    ],
  },
]

function ClipboardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="8" y="7" width="11" height="13" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M10 11h6M10 15h4" />
    </svg>
  )
}

type CardMode = "front" | "exiting" | "back" | "closing"

function CategoryCard({ category, cardIndex }: { category: Category; cardIndex: number }) {
  const [mode, setMode] = useState<CardMode>("front")
  const [prevMode, setPrevMode] = useState<CardMode>("front")
  const [templateIndex, setTemplateIndex] = useState(0)
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null)
  const [slideDir, setSlideDir] = useState<"forward" | "back" | null>(null)
  const bodyRef = useRef<HTMLPreElement>(null)
  const modeTimeoutRef = useRef<number | null>(null)
  const slideTimeoutRef = useRef<number | null>(null)

  // Reset scroll position when template changes
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0
    }
  }, [templateIndex])

  const templates = category.templates
  const total = templates.length
  const current = templates[templateIndex]

  // Click category card → open
  const openCard = () => {
    if (modeTimeoutRef.current !== null) {
      window.clearTimeout(modeTimeoutRef.current)
    }
    setPrevMode(mode)
    setMode("exiting")
    modeTimeoutRef.current = window.setTimeout(() => { setMode("back"); setTemplateIndex(0) }, 260)
  }

  // Click anywhere on template card → next, or close on last
  const onCardClick = () => {
    if (templateIndex < total - 1) {
      if (slideTimeoutRef.current !== null) {
        window.clearTimeout(slideTimeoutRef.current)
      }
      setSlideDir("forward")
      slideTimeoutRef.current = window.setTimeout(() => { setTemplateIndex((i) => i + 1); setSlideDir(null) }, 220)
    } else {
      // last template — vanish upward, back to category front
      if (modeTimeoutRef.current !== null) {
        window.clearTimeout(modeTimeoutRef.current)
      }
      setPrevMode(mode)
      setMode("closing")
      modeTimeoutRef.current = window.setTimeout(() => { setMode("front"); setTemplateIndex(0) }, 260)
    }
  }

  // ← arrow → previous template only, or back to category on first
  const onPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (templateIndex === 0) {
      // Back to category front
      if (modeTimeoutRef.current !== null) {
        window.clearTimeout(modeTimeoutRef.current)
      }
      setPrevMode(mode)
      setMode("closing")
      modeTimeoutRef.current = window.setTimeout(() => { setMode("front"); setTemplateIndex(0) }, 260)
      return
    }
    if (slideTimeoutRef.current !== null) {
      window.clearTimeout(slideTimeoutRef.current)
    }
    setSlideDir("back")
    slideTimeoutRef.current = window.setTimeout(() => { setTemplateIndex((i) => i - 1); setSlideDir(null) }, 220)
  }

  const copyTemplate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(current.body)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = current.body
      ta.style.cssText = "position:fixed;opacity:0"
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove()
    }
    setCopiedTitle(current.title)
    window.setTimeout(() => setCopiedTitle(null), 1600)
  }

  const frontClass = [
    "tpl-child-front",
    mode === "exiting" ? "is-exiting" : "",
    mode === "closing" ? "is-exiting" : "",
    mode === "back" ? "is-hidden" : "",
    mode === "front" && (prevMode === "back" || prevMode === "closing") ? "is-entering" : "",
  ].filter(Boolean).join(" ")

  const backClass = [
    "tpl-child-back",
    slideDir === "forward" ? "slide-forward" : "",
    slideDir === "back" ? "slide-back" : "",
    mode === "back" && !slideDir ? "is-entering" : "",
    mode === "closing" ? "slide-out-up" : "",
  ].filter(Boolean).join(" ")

  return (
    <div
      className={`tpl-card${mode === "back" ? " is-back" : ""}`}
      style={{ "--cards": total, "--card-delay": `${cardIndex * 55}ms` } as CSSProperties}
      onClick={mode === "front" ? openCard : undefined}
    >
      {templates.map((_, i) => (
        <div
          key={i}
          className="tpl-child"
          style={{ "--offset": i, zIndex: 5 - i } as CSSProperties}
        >
          {i === 0 && (
            <>
              <div className={frontClass}>
                <h2>{category.title}</h2>
                <p>{total} templates</p>
              </div>

              {(mode === "back" || mode === "closing") && (
                <div
                  className={backClass}
                  onClick={mode === "back" ? onCardClick : undefined}
                  style={{ cursor: mode === "back" ? "pointer" : "default" }}
                >
                  {/* ← goes to previous template or back to category */}
                  <button className="card-close-btn" onClick={onPrev} aria-label="Previous template">←</button>

                  <div className="deck-top-eyebrow">
                    <span>{String(templateIndex + 1).padStart(2, "0")}</span>
                    <span className="deck-top-sep">/</span>
                    <span>{total}</span>
                  </div>

                  <p className="deck-top-title">{current.title}</p>

                  <pre className="deck-top-body" ref={bodyRef}>{current.body}</pre>

                  <div className="deck-top-footer">
                    <div className="deck-mini-dots">
                      {templates.map((_, di) => (
                        <span key={di} className={`deck-mini-dot${di === templateIndex ? " is-active" : ""}`} />
                      ))}
                    </div>
                    <button
                      className={`copy-button${copiedTitle === current.title ? " is-copied" : ""}`}
                      onClick={copyTemplate}
                    >
                      <ClipboardIcon />
                      {copiedTitle === current.title ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default function TemplatesPage() {
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

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on interactive elements — they handle their own events
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, [data-no-drag]")) return;

    // Ignore clicks on template cards to allow their click handlers to work
    if (target.closest(".tpl-card")) return;

    if (raf.current !== null) { cancelAnimationFrame(raf.current); raf.current = null; }

    drag.current = { active: true, startX: e.clientX, startY: e.clientY, camX: cam.x, camY: cam.y };
    vel.current = { vx: 0, vy: 0, px: e.clientX, py: e.clientY, t: performance.now() };

    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [cam.x, cam.y]);

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

  useEffect(() => () => { if (raf.current !== null) cancelAnimationFrame(raf.current); }, []);

  return (
    <div
      className="templates-page"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div className="templates-ambient templates-ambient-two" />

      <div className="templates-shell" style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`, transition: isDragging ? "none" : "transform 0.1s ease-out", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64 }}>
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
          Templates
        </p>

        <div className="template-grid">
          {categories.map((category, i) => (
            <CategoryCard key={category.title} category={category} cardIndex={i} />
          ))}
        </div>
      </div>

      <NavPill active="templates" onNavigate={() => {}} />
    </div>
  )
}
