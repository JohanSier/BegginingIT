import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NavPill } from "../components/NavPill";
import { usePinSound } from "../hooks/usePinSound";
import {
  type PinState, GpsPin, Human,
  CARD_STYLE, CARD_TITLE, CARD_DIVIDER, CARD_BODY, InfoCard,
  DotPath, DimPath, Node, Btn, QText, HoverInfo, EndMarker,
  EscalationCard, VConnector, MobileNode, MobileFork,
} from "../components/roadmap/RoadmapKit";
import CallFlow from "../features/call-flow/CallFlow";
import TimeRule from "../features/time-rule/TimeRule";

// Type declaration for confetti loaded from CDN
declare global {
  interface Window {
    confetti: (options: any) => void;
  }
}

type Branch = "yes" | "no" | null;
type Progress = { analyze: boolean; call: boolean; work: boolean; doc: boolean; feedback: boolean; status: boolean; letKnow: boolean; escalate: boolean };
const EMPTY_PROGRESS: Progress = { analyze: false, call: false, work: false, doc: false, feedback: false, status: false, letKnow: false, escalate: false };

// ─── Desktop layout constants ─────────────────────────────────────────────────
const CW = 1700;
const CH = 560;
const NODE_Y = 262;
const Q1X = 152;
const Q1_YES_Y = NODE_Y;
const Q1_NO_Y  = NODE_Y + 78;
const XA = 200; const AY = NODE_Y;
const Q2X = 440; const Q2Y = NODE_Y - 28;
const Q2_YES_Y = Q2Y - 36; const Q2_NO_Y = Q2Y + 6;
const XC = 486; const CY = NODE_Y;
const XW = 630; const XD = 766; const Q3X = 898;
const Q3_YES_Y = NODE_Y - 42; const Q3_NO_Y = NODE_Y + 18;
const XE = 1010; const EY = NODE_Y + 50;
const UX = 330; const UY = NODE_Y + 88; const U_BTN_X = UX + 48;
const U_YES_Y = UY - 18; const U_NO_Y = UY + 34;
const XF = 1010; const XS = 1150; const XEND = 1325;

// ─── SVG paths ────────────────────────────────────────────────────────────────
const P_START      = `M ${76},${Q1_YES_Y} L ${Q1X},${Q1_YES_Y}`;
const P_Q1_YES     = `M ${Q1X},${Q1_YES_Y} C ${Q1X+15},${Q1_YES_Y-28} ${XA-16},${AY-28} ${XA},${AY}`;
const P_ANALYZE_Q2 = `M ${XA+12},${AY} C ${XA+80},${AY-32} ${Q2X-50},${Q2Y-8} ${Q2X},${Q2Y}`;
// A short incoming segment leaves clear space for the urgency question label.
const P_Q1_NO      = `M ${Q1X},${Q1_NO_Y} C ${Q1X+54},${Q1_NO_Y+26} ${UX-98},${UY-18} ${UX-70},${UY}`;
const P_URGENT_YES = `M ${U_BTN_X},${U_YES_Y} C ${U_BTN_X+42},${U_YES_Y-70} ${Q2X-45},${Q2Y+40} ${Q2X},${Q2Y}`;
const P_URGENT_NO  = `M ${U_BTN_X},${U_NO_Y} C ${U_BTN_X+95},${U_NO_Y+42} ${Q2X-55},${Q2Y+76} ${Q2X},${Q2Y}`;
const P_Q2_YES     = `M ${Q2X},${Q2_YES_Y} C ${Q2X+65},${Q2_YES_Y-44} ${XW-55},${Q2_YES_Y-44} ${XW},${NODE_Y}`;
const P_Q2_NO      = `M ${Q2X},${Q2_NO_Y} C ${Q2X+20},${CY} ${XC-16},${CY} ${XC},${CY}`;
const P_CALL_WORK  = `M ${XC+12},${CY} L ${XW-12},${NODE_Y}`;
const P_WORK_DOC   = `M ${XW+12},${NODE_Y} L ${XD-12},${NODE_Y}`;
const P_DOC_Q3     = `M ${XD+12},${NODE_Y} L ${Q3X-5},${NODE_Y}`;
const P_Q3_YES     = `M ${Q3X},${Q3_YES_Y} C ${Q3X+55},${Q3_YES_Y-38} ${XE-10},${Q3_YES_Y-32} ${XE},${Q3_YES_Y-8}`;
const P_Q3_NO      = `M ${Q3X},${Q3_NO_Y} C ${Q3X+40},${EY} ${XE-20},${EY} ${XE},${EY}`;
const P_FEEDBACK_STATUS = `M ${XF+12},${Q3_YES_Y-8} L ${XS+60-75},${Q3_YES_Y-8}`;
const P_STATUS_END = `M ${XS+0+5},${Q3_YES_Y-8} C ${XS+40+56},${Q3_YES_Y-34} ${XEND-20},${Q3_YES_Y-34} ${XEND + 80},${Q3_YES_Y-8}`;
const P_LET_KNOW_ESCALATE = `M ${XE+12},${EY} L ${XS + 75},${EY}`;
const P_ESC_END = `M ${XS + 30 + 52},${EY} C ${XS + 30 + 145},${EY+42} ${XEND},${EY+42} ${XEND},${EY}`;

// ─── Shared icons ─────────────────────────────────────────────────────────────



// ─── Mobile layout ─────────────────────────────────────────────────────────────
function MobileApp({ tab, setTab, vip, urgent, info, fixed, progress, complete, pickVip, pickUrgent, pickInfo, pickFixed }: {
  tab: string; setTab: (t: string) => void;
  vip: Branch; urgent: Branch; info: Branch; fixed: Branch;
  progress: Progress; complete: (step: keyof Progress) => void;
  pickVip: (v: "yes"|"no") => void;
  pickUrgent: (v: "yes"|"no") => void;
  pickInfo: (v: "yes"|"no") => void;
  pickFixed: (v: "yes"|"no") => void;
}) {
  const hasCall = info === "no";
  const q2Open = (vip === "yes" && progress.analyze) || (vip === "no" && urgent !== null);
  const workVis = q2Open && (info === "yes" || (info === "no" && progress.call));
  const docVis = workVis && progress.work;
  const q3Open  = docVis && progress.doc;
  const escVis  = fixed === "no" && progress.letKnow;
  const yesEnd  = fixed === "yes";

  const d = {
    call:    0,
    cw:      0.18,
    work:    hasCall ? 0.32 : 0.08,
    wd:      hasCall ? 0.48 : 0.22,
    doc:     hasCall ? 0.60 : 0.34,
    dq3:     hasCall ? 0.74 : 0.46,
    q3:      hasCall ? 0.84 : 0.56,
    escNode: 0.06,
    escCard: 0.32,
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#000",
      overflowY: "auto", paddingTop: 136, paddingBottom: 80,
      display: "flex", flexDirection: "column", alignItems: "center" }}>

      <NavPill active={tab} onNavigate={setTab} />
      <CallFlow />
      <TimeRule />

      <div style={{ width: "100%", maxWidth: 360, padding: "0 28px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

        {/* Human + Q1 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Human size={28} />
        </div>

        <MobileFork
          question="Is Ticket in VIP queue?"
          yesChosen={vip === "yes"} noChosen={vip === "no"}
          onYes={() => pickVip("yes")} onNo={() => pickVip("no")} />

        {/* VIP card (YES at Q1) */}
        <AnimatePresence>
          {false && vip === "yes" && (
            <motion.div key="vip-card"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
              style={{ marginTop: 16, width: "100%" }}>
              <InfoCard 
                title="Take it no matter the order"
                bullets={["VIP Queue always has priority"]} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Q1 → Q2 connector */}
        <AnimatePresence>
          {vip !== null && <VConnector key={`v1-${vip}`} delay={vip === "yes" ? 0.2 : 0.05} height={36} />}
        </AnimatePresence>

        {/* Analyze Info node (YES at Q1) */}
        <AnimatePresence>
          {vip === "yes" && (
            <>
              <MobileNode key="analyze" label="Analyze Information" state={progress.analyze ? "done" : "idle"} onClick={() => complete("analyze")} delay={0.08}
                hoverCard={<InfoCard title="Take it no matter the order" bullets={["VIP Queue always has priority"]} />} />
              <VConnector key="v-a-q2" delay={0.18} height={28} />
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {vip === "no" && (
            <MobileFork key="urgent"
              question="Is it an urgent ticket?"
              infoText="We treat tickets as urgent if an issue completely stops users from doing their work, or if it creates a security risk for the company (like a hacked account)."
              yesChosen={urgent === "yes"} noChosen={urgent === "no"}
              onYes={() => pickUrgent("yes")} onNo={() => pickUrgent("no")} borderRadius="2px 8px 8px 8px" />
          )}
        </AnimatePresence>

        {/* Q2 fork */}
        <AnimatePresence>
          {q2Open && (
            <MobileFork key={`q2-${vip}`}
              question="Is the information provided enough?"
              yesChosen={info === "yes"} noChosen={info === "no"}
              onYes={() => pickInfo("yes")} onNo={() => pickInfo("no")}
              borderRadius="2px 8px 8px 8px"
              delay={vip === "yes" ? 0.22 : 0.1} />
          )}
        </AnimatePresence>

        {/* 5Ws card + Call user (NO at Q2) */}
        <AnimatePresence>
          {false && info === "no" && (
            <>
              <VConnector key={`v-call-${info}`} delay={d.call} height={28} />
              <MobileNode key={`call-${info}`} label="Call the user" state={progress.call ? "done" : "idle"} onClick={() => complete("call")} delay={d.call}
                hoverCard={<InfoCard title="Gather more information using 5 Ws" bullets={["1. Most Important: Do Caller Verify", "2. Mention the call will be recorded for security and training purposes" ]} />} />
              <motion.div key={`call-card-${info}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.35, delay: d.cw }}
                style={{marginTop: 12, width: "100%" }}>
                <InfoCard 
                  title="Gather more information using 5 Ws"
                  bullets={[
                    "1. Most Important: Do Caller Verify", 
                    "2. Mention the call will be recorded for security and training purposes",
                  ]} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Work the Ticket */}
        <AnimatePresence>
          {workVis && (
            <>
              <VConnector key={`v-work-${info}`} delay={d.work - 0.1} height={28} />
              <MobileNode key={`work-${info}`} label="Work the Ticket"
                state={progress.work ? "done" : "idle"} onClick={() => complete("work")} delay={d.work} />
            </>
          )}
        </AnimatePresence>

        {/* Document Everything */}
        <AnimatePresence>
          {docVis && (
            <>
              <VConnector key={`v-doc-${info}`} delay={d.wd} height={28} />
              <MobileNode key={`doc-${info}`} label="Document Everything"
                state={progress.doc ? "done" : "idle"} onClick={() => complete("doc")} delay={d.doc}
                hoverCard={<InfoCard title="Write everything you did to solve the issue in bullet points. You can call the user to confirm what you did to solve issue (optional)" bullets={["1. There should be internal notes", "2. Screenshots are encouraged!"]} />} />
            </>
          )}
        </AnimatePresence>

        {/* Q3 fork */}
        <AnimatePresence>
          {q3Open && (
            <>
              <VConnector key={`v-q3-${info}`} delay={d.dq3} height={28} />
              <MobileFork key={`q3-${info}`}
                question="Did the issue get fixed?"
                yesChosen={fixed === "yes"} noChosen={fixed === "no"}
                onYes={() => pickFixed("yes")} onNo={() => pickFixed("no")}
                borderRadius="2px 8px 8px 8px"
                delay={d.q3} />
            </>
          )}
        </AnimatePresence>

        {/* YES resolution card */}
        <AnimatePresence>
          {yesEnd && (
            <motion.div key={`yes-card-${fixed}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
              style={{ marginTop: 14, width: "100%" }}>
              <MobileNode label="Give feedback to Higgy" state={progress.feedback ? "done" : "idle"} onClick={() => complete("feedback")}
                hoverCard={<InfoCard title="Higgy is our AI assistant that helps us understand tickets better."/>} />
              <VConnector height={26} />
              {progress.feedback && <MobileNode label={'Change ticket status from “Open” to “Solved”'} state={progress.status ? "done" : "idle"} onClick={() => complete("status")} />}
              <VConnector height={26} />
              {progress.status && <EndMarker />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Escalate */}
        <AnimatePresence>
          {escVis && (
            <>
              <VConnector key={`v-esc-${fixed}`} delay={d.escNode} height={28} />
              <MobileNode key={`esc-${fixed}`} label="Let user know"
                sublabel="you'll escalate it" state={progress.letKnow ? "done" : "idle"} onClick={() => complete("letKnow")} delay={d.escNode}
                hoverCard={<EscalationCard compact />} />
              {false && <motion.div key={`esc-card-${fixed}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.35, delay: d.escCard }}
                style={{ marginTop: 14, width: "100%" }}>
                <EscalationCard compact />
              </motion.div>}
              <VConnector height={26} />
              {progress.letKnow && <MobileNode label="Escalate Case" state={progress.escalate ? "done" : "idle"} onClick={() => complete("escalate")} />}
              <p style={{ margin: "-3px 0 0", color: "rgba(255,255,255,0.72)", fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 14, textAlign: "center" }}>Leave the ticket status in “Open”</p>
              <VConnector height={26} />
              {progress.escalate && <EndMarker />}
            </>
          )}
        </AnimatePresence>

        {/* Restart */}
        <AnimatePresence>
          {vip !== null && (
            <motion.button key="rst-m"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { pickVip(vip!); }}
              style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", fontFamily: "Lato,sans-serif", fontStyle: "italic",
                fontSize: 17, color: "rgba(255,255,255,0.38)", background: "transparent",
                border: "none", cursor: "pointer", letterSpacing: "0.06em" }}>
              ↺ restart journey
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Desktop layout — infinite pannable canvas ───────────────────────────────
function DesktopApp({ tab, setTab, vip, urgent, info, fixed, progress, complete, pickVip, pickUrgent, pickInfo, pickFixed }: {
  tab: string; setTab: (t: string) => void;
  vip: Branch; urgent: Branch; info: Branch; fixed: Branch;
  progress: Progress; complete: (step: keyof Progress) => void;
  pickVip: (v: "yes"|"no") => void;
  pickUrgent: (v: "yes"|"no") => void;
  pickInfo: (v: "yes"|"no") => void;
  pickFixed: (v: "yes"|"no") => void;
}) {
  // ── Camera state: world-space origin of the viewport ──────────────────────
  // x/y = where in world-space the viewport top-left maps to (negative = panned right)
  // z = zoom level (1 = default, >1 = zoomed in, <1 = zoomed out)
  const [cam, setCam] = useState<{ x: number; y: number; z: number }>(() => {
    if (typeof window === "undefined") return { x: 0, y: 0, z: 1 };
    return {
      x: Math.round(window.innerWidth * 0.09),
      y: Math.round(window.innerHeight / 2 - CH / 2 + 28),
      z: 1,
    };
  });

  const [isDragging, setIsDragging] = useState(false);

  // Refs: mutable drag/inertia state that doesn't need re-renders
  const drag = useRef({ active: false, startX: 0, startY: 0, camX: 0, camY: 0 });
  const vel  = useRef({ vx: 0, vy: 0, px: 0, py: 0, t: 0 });
  const raf  = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-pan: workflow advances camera left as user makes choices
  // This is added ON TOP of the user's manual cam position
  const autoPanX = fixed !== null ? -540 : info !== null ? -348 : urgent !== null ? -220 : vip !== null ? -108 : 0;

  // Combined scene transform — camera + auto-advance
  // When dragging: no CSS transition (instant follow)
  // When auto-panning on choice: smooth ease-out spring feel via CSS
  const sceneX = cam.x + autoPanX;
  const sceneY = cam.y;

  // ── Pointer handlers ──────────────────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Ignore clicks on interactive elements — they handle their own events
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, [data-no-drag]")) return;

    if (raf.current !== null) { cancelAnimationFrame(raf.current); raf.current = null; }

    drag.current = { active: true, startX: e.clientX, startY: e.clientY, camX: cam.x, camY: cam.y };
    vel.current  = { vx: 0, vy: 0, px: e.clientX, py: e.clientY, t: performance.now() };

    setIsDragging(true);
    // Capture pointer so we keep receiving move/up even outside the element
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;

    const now = performance.now();
    const dt  = now - vel.current.t;
    if (dt > 0) {
      // Rolling velocity in px/ms → store for inertia
      vel.current.vx = (e.clientX - vel.current.px) / dt;
      vel.current.vy = (e.clientY - vel.current.py) / dt;
      vel.current.px = e.clientX;
      vel.current.py = e.clientY;
      vel.current.t  = now;
    }

    setCam({
      x: drag.current.camX + (e.clientX - drag.current.startX),
      y: drag.current.camY + (e.clientY - drag.current.startY),
      z: cam.z,
    });
  }

  function onPointerUp() {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);

    // Inertia: decay velocity over time
    let { vx, vy } = vel.current;
    const FRICTION = 0.88; // per 16 ms frame

    function step() {
      vx *= FRICTION;
      vy *= FRICTION;
      // Stop when below 0.05 px/ms (≈ 3px/s)
      if (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05) { raf.current = null; return; }
      setCam(c => ({ x: c.x + vx * 16, y: c.y + vy * 16, z: c.z }));
      raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
  }

  // ── Zoom handlers ───────────────────────────────────────────────────────────
  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    // Check if scrolling inside a scrollable element (like the escalation card template)
    const target = e.target as HTMLElement;
    const scrollableElement = target.closest('[style*="overflow"], [style*="overflowY"], [style*="overflowX"]');
    
    // If inside a scrollable element that can scroll, allow normal scrolling
    if (scrollableElement) {
      const computedStyle = window.getComputedStyle(scrollableElement);
      const overflow = computedStyle.overflow;
      const overflowY = computedStyle.overflowY;
      const overflowX = computedStyle.overflowX;
      
      // Check if the element is actually scrollable
      if ((overflow === 'auto' || overflow === 'scroll' || overflowY === 'auto' || overflowY === 'scroll' || overflowX === 'auto' || overflowX === 'scroll') &&
          (scrollableElement.scrollHeight > scrollableElement.clientHeight || scrollableElement.scrollWidth > scrollableElement.clientWidth)) {
        return; // Allow normal scrolling
      }
    }

    // Trackpad pinch gesture on Mac (ctrlKey + pinch)
    // Regular scroll wheel for mouse users
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1; // Zoom out for scroll down, in for scroll up
    const newZoom = Math.max(0.5, Math.min(3, cam.z + delta)); // Clamp between 0.5x and 3x

    setCam(c => ({ ...c, z: newZoom }));
  }

  // Add keyboard event listener for zoom shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Keyboard shortcuts for zoom
      if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setCam(c => ({ ...c, z: Math.min(3, c.z + 0.2) })); // Zoom in
      } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        setCam(c => ({ ...c, z: Math.max(0.5, c.z - 0.2) })); // Zoom out
      } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        setCam(c => ({ ...c, z: 1 })); // Reset zoom
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { if (raf.current !== null) cancelAnimationFrame(raf.current); }, []);

  // ── Derived state ─────────────────────────────────────────────────────────
  const q2Open  = (vip === "yes" && progress.analyze) || (vip === "no" && urgent !== null);
  const callVis = q2Open && info === "no";
  const workVis = q2Open && (info === "yes" || (info === "no" && progress.call));
  const docVis  = workVis && progress.work;
  const q3Open  = docVis && progress.doc;
  const escVis  = fixed === "no" && progress.letKnow;
  const yesEnd  = fixed === "yes";

  const hasCall = info === "no";
  const d = {
    call: 0, callWork: 0.22,
    work:    hasCall ? 0.38 : 0.05,
    workDoc: hasCall ? 0.56 : 0.22,
    doc:     hasCall ? 0.70 : 0.36,
    docQ3:   hasCall ? 0.86 : 0.50,
    q3text:  hasCall ? 0.96 : 0.60,
    escCard: 0.3,
  };

  const Q1_TEXT_Y = ((Q1_YES_Y - 20) + (Q1_NO_Y + 12)) / 2 - 9;

  return (
    <>
      <NavPill active={tab} onNavigate={setTab} />
      <CallFlow />
      <TimeRule />

      {/* ── Infinite canvas viewport ── */}
      <div
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={handleWheel}
        style={{
          position: "fixed", inset: 0,
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab",
          // Touch: prevent default browser scroll so we can pan
          touchAction: "none",
        }}
      >
        {/* ── World container: camera transform applied here ── */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: CW,
            height: CH,
            transform: `translate(${sceneX}px, ${sceneY}px) scale(${cam.z})`,
            // Smooth transition for auto-pan advances; instant while dragging
            transition: isDragging
              ? "none"
              : "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
            transformOrigin: "0 0",
          }}
        >
          {/* ── SVG dotted paths (pointer-events: none — never block canvas drag) ── */}
          <svg width={CW} height={CH}
            style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
            <DimPath d={P_START}  bright={true} />
            <DimPath d={P_Q1_YES} bright={vip === "yes"} />
            <DimPath d={P_Q1_NO}  bright={vip === "no"} />
            <DimPath d={P_Q1_NO}  bright={vip === "no"} />
            <AnimatePresence>
              {vip === "no" && (
                <>
                  <DimPath d={P_URGENT_YES} bright={urgent === "yes"} />
                  <DimPath d={P_URGENT_NO} bright={urgent === "no"} />
                </>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {vip === "yes" && <DotPath key="a-q2" d={P_ANALYZE_Q2} delay={0.12} />}
            </AnimatePresence>
            <AnimatePresence>
              {q2Open && (
                <>
                  <DimPath key={`q2y-${vip}`} d={P_Q2_YES} bright={info === "yes"} />
                  <DimPath key={`q2n-${vip}`} d={P_Q2_NO}  bright={info === "no"} />
                </>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {callVis && progress.call && <DotPath key={`cw-${info}`}  d={P_CALL_WORK} delay={d.callWork} />}
            </AnimatePresence>
            <AnimatePresence>
              {docVis && <DotPath key={`wd-${info}`}  d={P_WORK_DOC}  delay={d.workDoc} />}
            </AnimatePresence>
            <AnimatePresence>
              {q3Open && <DotPath key={`dq-${info}`}  d={P_DOC_Q3}    delay={d.docQ3} />}
            </AnimatePresence>
            <AnimatePresence>
            {q3Open && (
                <>
                  <DimPath key={`q3y-${info}`} d={P_Q3_YES} bright={fixed === "yes"} />
                  <DimPath key={`q3n-${info}`} d={P_Q3_NO}  bright={fixed === "no"} />
                </>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {yesEnd && <DotPath d={P_FEEDBACK_STATUS} delay={0.22} />}
              {yesEnd && progress.feedback && <DotPath d={P_STATUS_END} delay={0.36} />}
              {fixed === "no" && <DotPath d={P_LET_KNOW_ESCALATE} delay={0.2} />}
              {escVis && progress.escalate && <DotPath d={P_ESC_END} delay={0.3} />}
            </AnimatePresence>
          </svg>

          {/* ── Human figure ── */}
          <div style={{ position: "absolute", left: 68, top: NODE_Y - 38 }}><Human /></div>

          {/* ── Q1 question (fades out once answered) ── */}
          <AnimatePresence>
            {vip !== "yes" && (
              <motion.div key="q1text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                data-no-drag
                style={{ position: "absolute", left: Q1X - 30, top: Q1_TEXT_Y,
                  fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 15,
                  color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap",
                  cursor: "text", userSelect: "none" }}>
                Is Ticket in VIP queue?
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Q1 Yes / No ── */}
          <Btn label="Yes" x={Q1X} y={Q1_YES_Y - 20} chosen={vip === "yes"} onClick={() => pickVip("yes")} />
          <Btn label="No"  x={Q1X} y={Q1_NO_Y + 12}  chosen={vip === "no"}  onClick={() => pickVip("no")} />

          {/* ── Urgent ticket check (NO at Q1) ── */}
          <AnimatePresence>
            {vip === "no" && <QText key="urgent-text" x={UX - 50} y={UY + -5}
              text="Is it an urgent ticket?"
              infoText="We treat tickets as urgent if an issue completely stops users from doing their work, or if it creates a security risk for the company (like a hacked account)."
              infoSize={13} delay={0.08} borderRadius="2px 8px 8px 8px" />}
          </AnimatePresence>
          {vip === "no" && (
            <>
              <Btn label="Yes" x={U_BTN_X} y={U_YES_Y - 16} chosen={urgent === "yes"} onClick={() => pickUrgent("yes")} />
              <Btn label="No" x={U_BTN_X} y={U_NO_Y + 12} chosen={urgent === "no"} onClick={() => pickUrgent("no")} />
            </>
          )}

          {/* ── Analyze Information ── */}
          <AnimatePresence>
            {vip === "yes" && <Node key="analyze" x={XA} y={AY} label="Analyze Information"
              state={progress.analyze ? "done" : "idle"} onClick={() => complete("analyze")} delay={0.06}
              hoverCard={<InfoCard title="Take it no matter the order" bullets={["VIP Queue always has priority"]} style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "2px" }} />}
              cardStyle={{ left: -48, top: -160 }} />}
          </AnimatePresence>

          {/* ── Q2 ── */}
          <AnimatePresence>
            {q2Open && <QText key={`q2t-${vip}`} x={Q2X - 100} y={Q2Y - 28}
              text="Is the information provided enough?" delay={0.1} />}
          </AnimatePresence>
          {q2Open && (
            <>
              <Btn label="Yes" x={Q2X} y={Q2_YES_Y - 14} chosen={info === "yes"} onClick={() => pickInfo("yes")} />
              <Btn label="No"  x={Q2X} y={Q2_NO_Y + 14}  chosen={info === "no"}  onClick={() => pickInfo("no")} />
            </>
          )}

          {/* ── Call the user ── */}
          <AnimatePresence>
            {callVis && <Node key={`call-${info}`} x={XC} y={CY} label="Call the user"
              state={progress.call ? "done" : "idle"} onClick={() => complete("call")} delay={d.call}
              hoverCard={<InfoCard title="Gather more information using 5 Ws" bullets={["1. Most Important: Do Caller Verify", "2. Mention the call will be recorded for security and training purposes"]} />}
              cardStyle={{ left: -30, top: 60 }} />}
          </AnimatePresence>

          {/* ── Work the Ticket ── */}
          <AnimatePresence>
            {workVis && (
              <Node key={`work-${info}`} x={XW} y={NODE_Y} label="Work the Ticket"
                state={progress.work ? "done" : "idle"} onClick={() => complete("work")} delay={d.work} />
            )}
          </AnimatePresence>

          {/* ── Document Everything ── */}
          <AnimatePresence>
            {docVis && (
              <Node key={`doc-${info}`} x={XD - 25} y={NODE_Y} label="Document Everything"
                state={progress.doc ? "done" : "idle"} onClick={() => complete("doc")} delay={d.doc}
                hoverCard={<InfoCard width={170} title="Write everything you did as an internal note and in bullet points. Call the user to confirm what you did to solve issue (optional)" bullets={["1. There should be internal notes", "2. Screenshots are encouraged!"]} />}
                cardStyle={{ left: -15, top: 65}} />
            )}
          </AnimatePresence>

          {/* ── Q3 ── */}
          <AnimatePresence>
            {q3Open && <QText key={`q3t-${info}`} x={Q3X - 68} y={NODE_Y - 35}
              text="Did the issue get fixed?" delay={d.q3text} />}
          </AnimatePresence>
          {q3Open && (
            <>
              <Btn label="Yes" x={Q3X} y={Q3_YES_Y - 14} chosen={fixed === "yes"} onClick={() => pickFixed("yes")} />
              <Btn label="No"  x={Q3X + 20} y={Q3_NO_Y + 14}  chosen={fixed === "no"}  onClick={() => pickFixed("no")} />
            </>
          )}

          {/* ── Escalate ── */}
          <AnimatePresence>
            {fixed === "no" && (
              <Node key={`esc-${fixed}`} x={XE} y={EY} label="Let user know"
                sublabel="you'll escalate it" state={progress.letKnow ? "done" : "idle"} onClick={() => complete("letKnow")} delay={0}
                hoverCard={<EscalationCard />} cardStyle={{ left: -64, top: 72 }} />
            )}
          </AnimatePresence>

          {/* ── Completion paths ── */}
          <AnimatePresence>
            {yesEnd && <>
              <Node key="feedback" x={XF} y={Q3_YES_Y - 8} label="Give feedback to Higgy"
                state={progress.feedback ? "done" : "idle"} onClick={() => complete("feedback")} delay={0.08} />
              <QText key="feedback-info" x={XF + 45} y={Q3_YES_Y + 30}
                text=""
                infoText="Higgy is our AI assistant that helps us understand tickets better."
                infoSize={13} delay={0.08} cardStyle={{ left: -20, top: 25}} borderRadius="2px 8px 8px 8px" />
              {progress.feedback && <Node key="status-solved" x={XS + 60} y={Q3_YES_Y - 5} label={'Change ticket status from “Open”'} sublabel={'to “Solved”'}
                state={progress.status ? "done" : "idle"} onClick={() => complete("status")} delay={0.22} />}
              {progress.status && <EndMarker x={XEND} y={Q3_YES_Y - 8} delay={0.38} />}
            </>}
            {escVis && <>
              <Node key="escalate-case" x={XS + 30} y={EY} label="Escalate Case" state={progress.escalate ? "done" : "idle"} onClick={() => complete("escalate")} delay={0.14} />
              <QText key="escalate-info" x={XS + 98} y={EY + 17}
                text=""
                infoText="Leave the ticket status in Open"
                infoSize={13} delay={0.14} cardStyle={{ left: -20, top: 25}} borderRadius="2px 8px 8px 8px" />
              {progress.escalate && <EndMarker x={XEND - 135} y={EY - 70} delay={0.42} />}
            </>}
          </AnimatePresence>

        </div>{/* end world */}
      </div>{/* end canvas viewport */}

      {/* Restart — fixed overlay, outside the panning world */}
      <AnimatePresence>
        {vip !== null && (
          <motion.button key="rst"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => pickVip(vip!)}
            style={{ position: "fixed", top: 40, left: "50%", transform: "translateX(-50%)",
              fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 17,
              color: "rgba(255,255,255,0.38)", background: "transparent",
              border: "none", cursor: "pointer", letterSpacing: "0.06em", zIndex: 50 }}>
            ↺ restart journey
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { playSound } = usePinSound();
  const [tab, setTab]     = useState("home");
  const [vip, setVip]     = useState<Branch>(null);
  const [urgent, setUrgent] = useState<Branch>(null);
  const [info, setInfo]   = useState<Branch>(null);
  const [fixed, setFixed] = useState<Branch>(null);
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [mobile, setMobile] = useState(false);
  const [playedSounds, setPlayedSounds] = useState<Set<keyof Progress>>(new Set());

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function pickVip(v: "yes" | "no") {
    setProgress(EMPTY_PROGRESS);
    if (vip === v) { setVip(null); setUrgent(null); setInfo(null); setFixed(null); }
    else           { setVip(v);   setUrgent(null); setInfo(null); setFixed(null); }
  }
  function pickUrgent(v: "yes" | "no") {
    setProgress(EMPTY_PROGRESS);
    if (urgent === v) { setUrgent(null); setInfo(null); setFixed(null); }
    else              { setUrgent(v);   setInfo(null); setFixed(null); }
  }
  function pickInfo(v: "yes" | "no") {
    setProgress(p => ({ ...EMPTY_PROGRESS, analyze: p.analyze }));
    if (info === v) { setInfo(null); setFixed(null); }
    else            { setInfo(v);   setFixed(null); }
  }
  function pickFixed(v: "yes" | "no") {
    setProgress(p => ({ ...p, feedback: false, status: false, letKnow: false, escalate: false }));
    if (fixed === v) setFixed(null);
    else             setFixed(v);
  }

  function complete(step: keyof Progress) {
    // Only play regular pin sound for non-final steps
    if (!playedSounds.has(step) && step !== "status" && step !== "escalate") {
      playSound();
      setPlayedSounds(prev => new Set(prev).add(step));
    }
    
    setProgress(p => {
      if (p[step]) {
        // Turning a checkpoint off also retracts everything that depends on it.
        if (step === "analyze") return EMPTY_PROGRESS;
        if (step === "call") return { ...p, call: false, work: false, doc: false, feedback: false, status: false, letKnow: false, escalate: false };
        if (step === "work") return { ...p, work: false, doc: false, feedback: false, status: false, letKnow: false, escalate: false };
        if (step === "doc") return { ...p, doc: false, feedback: false, status: false, letKnow: false, escalate: false };
        if (step === "feedback") return { ...p, feedback: false, status: false };
        if (step === "letKnow") return { ...p, letKnow: false, escalate: false };
        return { ...p, [step]: false };
      }
      const newProgress = { ...p, [step]: true };

      // Trigger success sound and confetti for final steps
      if (step === "status" || step === "escalate") {
        // Play success sound immediately (instead of regular pin sound)
        const successAudio = new Audio('/success.mov');
        successAudio.volume = 0.4;
        successAudio.play().catch((error) => {
          console.error('Success sound playback failed:', error);
        });
        
        // Trigger confetti after 2 seconds
        setTimeout(() => {
          launchConfetti();
        }, 2000);
      }

      return newProgress;
    });
  }

  function launchConfetti() {
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

    // Final burst after the duration
    setTimeout(() => {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });
    }, duration);
  }

  const shared = { tab, setTab, vip, urgent, info, fixed, progress, complete, pickVip, pickUrgent, pickInfo, pickFixed };

  return (
    <div style={{ width: "100vw", height: mobile ? "auto" : "100vh",
      minHeight: "100vh", overflow: mobile ? "visible" : "hidden",
      background: "#000", position: "relative" }}>
      {mobile
        ? <MobileApp {...shared} />
        : <DesktopApp {...shared} />
      }
    </div>
  );
}
