import { useState, useRef, useCallback, useEffect, type CSSProperties, type PointerEvent } from "react"
import { NavPill } from "../../components/NavPill"

type Template = { title: string; body: string }
type Category = { title: string; templates: Template[] }

const categories: Category[] = [
  {
    title: "Greetings",
    templates: [
      { title: "A warm welcome", body: "Hi [Name],\n\nWelcome to BeginningIT — great to have you here. I'm here if you need a hand getting started." },
      { title: "A quick hello", body: "Hey [Name]!\n\nJust checking in. How can I help you today?" },
      { title: "First response", body: "Hello [Name],\n\nThanks for reaching out. I've got your message and I'm taking a look now." },
    ],
  },
  {
    title: "Ticket updates",
    templates: [
      { title: "We're on it", body: "Hi [Name],\n\nThanks for flagging this. I'm investigating the issue and will update you as soon as I have more information." },
      { title: "Need more details", body: "Hi [Name],\n\nCould you share a screenshot and the steps you took before the issue appeared? That will help me reproduce it." },
      { title: "Resolved", body: "Hi [Name],\n\nThis is now resolved. Please try again when you have a moment, and let me know if anything still feels off." },
      { title: "Still investigating", body: "Hi [Name],\n\nI'm still looking into this and wanted to keep you in the loop. I'll send another update shortly." },
    ],
  },
  {
    title: "Follow-ups",
    templates: [
      { title: "Gentle nudge", body: "Hi [Name],\n\nJust following up on my last note — I wanted to make sure it didn't get buried.\n\nWhen you have a moment, could you let me know how you'd like to proceed? Even a quick reply helps me keep things moving on my end.\n\nNo rush at all, just checking in. Happy to hop on a call if that's easier than going back and forth over email." },
      { title: "Checking in", body: "Hi [Name],\n\nI wanted to circle back and see how things are going on your end.\n\nDid you get a chance to try the steps I suggested? If anything felt unclear or didn't work as expected, please do let me know — I'm happy to walk through it together.\n\nAlso, if the situation has changed since we last spoke, just let me know and we can adjust the approach. I'm here whenever you're ready to pick this back up." },
    ],
  },
  {
    title: "Scheduling",
    templates: [
      { title: "Set up a call", body: "Hi [Name],\n\nWould a quick call be helpful? Send over a couple of times that work for you and I'll find a slot." },
      { title: "Meeting reminder", body: "Hi [Name],\n\nA quick reminder about our session at [time]. Looking forward to speaking with you." },
      { title: "Reschedule", body: "Hi [Name],\n\nNo problem at all — let's find another time. What does your availability look like this week?" },
    ],
  },
  {
    title: "Feedback",
    templates: [
      { title: "Ask for feedback", body: "Hi [Name],\n\nI'd love to hear how that worked for you. Is there anything we could make clearer or better?" },
      { title: "Thank you", body: "Hi [Name],\n\nThank you for the thoughtful feedback. I really appreciate you taking the time to share it." },
      { title: "Feature request", body: "Hi [Name],\n\nThat's a helpful idea. I've captured it for the team and will keep you posted if it moves forward." },
    ],
  },
  {
    title: "Boundaries",
    templates: [
      { title: "Set expectations", body: "Hi [Name],\n\nI want to make sure I set the right expectation: this will take a little time to resolve. I'll keep you updated throughout." },
      { title: "Not in scope", body: "Hi [Name],\n\nI understand what you're aiming for. That isn't something we can support right now, but here's the closest option available: [option]." },
      { title: "Close the loop", body: "Hi [Name],\n\nSince I haven't heard back, I'm going to close this for now. You can always reply here to reopen the conversation." },
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
  const [templateIndex, setTemplateIndex] = useState(0)
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null)
  const [slideDir, setSlideDir] = useState<"forward" | "back" | null>(null)

  const templates = category.templates
  const total = templates.length
  const current = templates[templateIndex]

  // Click category card → open
  const openCard = () => {
    setMode("exiting")
    window.setTimeout(() => { setMode("back"); setTemplateIndex(0) }, 260)
  }

  // Click anywhere on template card → next, or close on last
  const onCardClick = () => {
    if (templateIndex < total - 1) {
      setSlideDir("forward")
      window.setTimeout(() => { setTemplateIndex((i) => i + 1); setSlideDir(null) }, 220)
    } else {
      // last template — vanish upward, back to category front
      setMode("closing")
      window.setTimeout(() => { setMode("front"); setTemplateIndex(0) }, 260)
    }
  }

  // ← arrow → previous template only
  const onPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (templateIndex === 0) return
    setSlideDir("back")
    window.setTimeout(() => { setTemplateIndex((i) => i - 1); setSlideDir(null) }, 220)
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
  ].filter(Boolean).join(" ")

  const backClass = [
    "tpl-child-back",
    slideDir === "forward" ? "slide-forward" : "",
    slideDir === "back" ? "slide-back" : "",
    mode === "back" && !slideDir ? "is-entering" : "",
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
                  {/* ← goes to previous template; hidden on first */}
                  {templateIndex > 0 && (
                    <button className="card-close-btn" onClick={onPrev} aria-label="Previous template">←</button>
                  )}

                  <div className="deck-top-eyebrow">
                    <span>{String(templateIndex + 1).padStart(2, "0")}</span>
                    <span className="deck-top-sep">/</span>
                    <span>{total}</span>
                  </div>

                  <p className="deck-top-title">{current.title}</p>

                  <pre className="deck-top-body">{current.body}</pre>

                  <div className="deck-top-footer" onClick={(e) => e.stopPropagation()}>
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
