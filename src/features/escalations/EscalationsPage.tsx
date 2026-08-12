import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NavPill } from "../../components/NavPill";
import { usePinSound } from "../../hooks/usePinSound";
import {
  Human, InfoCard, DotPath, DimPath, Node, Btn, QText, EndMarker,
  VConnector, MobileNode, MobileFork, CARD_NOTE,
} from "../../components/roadmap/RoadmapKit";
import { QUESTIONS, DESTINATION, DOC_BULLETS, DOC_NOTE, type QNum } from "./escalationsContent";

// Type declaration for confetti loaded from CDN (already loaded by the Home page)
declare global {
  interface Window {
    confetti: (options: any) => void;
  }
}

type Branch = "yes" | "no" | null;
type Answers = Record<QNum, Branch>;
const EMPTY_ANSWERS: Answers = { 1: null, 2: null, 3: null, 4: null };

type FlowProgress = { doc: boolean; notify: boolean; escalate: boolean };
const EMPTY_FLOW: FlowProgress = { doc: false, notify: false, escalate: false };

// ─── Desktop layout constants ─────────────────────────────────────────────
const CW = 2100;
const CH = 640;
const NODE_Y = 280;
const QX: Record<QNum, number> = { 1: 172, 2: 430, 3: 688, 4: 946 };

// The spine (No → keep asking) stays right on NODE_Y — same y the incoming
// line arrives on, so "No" reads as "stay the course." "Yes" is deliberately
// placed well below, so its branch is unmistakably a different path.
const NO_Y = NODE_Y;
const YES_Y = NODE_Y + 92;

const SHARED_Y = NODE_Y + 176;
const DOC_X = 1080;
const NOTIFY_X = 1400;
const ESC_X = 1700;
const END_X = 1930;
const NO_MORE_X = QX[4] + 190;

function yesPath(qx: number) {
  return `M ${qx},${YES_Y} C ${qx + 30},${SHARED_Y - 55} ${DOC_X - 140},${SHARED_Y - 55} ${DOC_X - 16},${SHARED_Y}`;
}
function noPath(fromX: number, toX: number) {
  return `M ${fromX + 18},${NO_Y} L ${toX - 18},${NO_Y}`;
}

const P_START = `M 74,${NODE_Y} L ${QX[1] - 18},${NO_Y}`;
const P_Q1_NO = `M ${QX[1] + 50},${YES_Y - 170} C ${QX[1] + 105},${YES_Y - 288} ${QX[2] - 60},${YES_Y - 50} ${QX[2] + 20},${YES_Y - 100}`;
const P_Q2_NO = `M ${QX[2] + 50},${NODE_Y - 60} C ${QX[2] + 105},${NODE_Y - 258} ${QX[3] - 16},${YES_Y + 50} ${QX[3] + 50},${NODE_Y}`;
const P_Q3_NO = `M ${QX[3] + 50},${NODE_Y - 60} C ${QX[3] + 105},${NODE_Y - 258} ${QX[4] - 16},${YES_Y + 50} ${QX[4] + 50},${NODE_Y}`;
const P_Q4_NO = `M ${QX[4] + 50},${NODE_Y - 60} C ${QX[4] + 105},${NODE_Y - 258} ${NO_MORE_X - 16},${YES_Y + 50} ${NO_MORE_X + 50},${NODE_Y}`;
const P_Q1_YES = `M ${QX[1]},${NODE_Y + 100} C ${QX[1] + 130},${SHARED_Y - 55} ${DOC_X - 40},${NODE_Y + 70} ${DOC_X - 66},${SHARED_Y}`;
const P_Q2_YES = yesPath(QX[2]);
const P_Q3_YES = yesPath(QX[3]);
const P_Q4_YES = `M ${QX[4]},${NODE_Y + 100} C ${QX[4] + 30},${SHARED_Y - 55} ${DOC_X - 140},${SHARED_Y - 5} ${DOC_X - 16},${SHARED_Y}`;
const P_DOC_NOTIFY = `M ${DOC_X + 12},${SHARED_Y} L ${NOTIFY_X - 12},${SHARED_Y}`;
const P_NOTIFY_ESC = `M ${NOTIFY_X + 12},${SHARED_Y} L ${ESC_X - 12},${SHARED_Y}`;
const P_ESC_END = `M ${ESC_X + 12},${SHARED_Y} L ${END_X - 12},${SHARED_Y}`;
const YES_PATHS: Record<QNum, string> = { 1: P_Q1_YES, 2: P_Q2_YES, 3: P_Q3_YES, 4: P_Q4_YES };
const NO_PATHS: Record<QNum, string> = { 1: P_Q1_NO, 2: P_Q2_NO, 3: P_Q3_NO, 4: P_Q4_NO };

// ─── Shared documentation/notify/escalate cards (content is trigger-aware) ──
function DocCard({ trigger }: { trigger: QNum }) {
  return (
    <InfoCard width={190} title=""
      bullets={DOC_BULLETS[trigger]} note={DOC_NOTE[trigger]} />
  );
}
function NotifyCard() {
  return (
    <InfoCard width={180} title="" bullets={[
      "Let them know the ticket is being escalated",
      "By email, or by phone if you're already speaking with them",
    ]} />
  );
}
function EscalateCard({ trigger }: { trigger: QNum }) {
  return (
    <InfoCard width={180} title=""
      note={`Transfer this ticket to ${DESTINATION[trigger]}. Leave the ticket status in "Open".`} />
  );
}

// ─── Root ───────────────────────────────────────────────────────────────────
export function EscalationsPage() {
  const { playSound } = usePinSound();
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [flow, setFlow] = useState<FlowProgress>(EMPTY_FLOW);
  const [mobile, setMobile] = useState(false);
  const [playedSounds, setPlayedSounds] = useState<Set<keyof FlowProgress>>(new Set());
  const [triggeredNoMoreConfetti, setTriggeredNoMoreConfetti] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const trigger = ([1, 2, 3, 4] as QNum[]).find(n => answers[n] === "yes") ?? null;
  const allNo = ([1, 2, 3, 4] as QNum[]).every(n => answers[n] === "no");

  useEffect(() => {
    if (allNo && !triggeredNoMoreConfetti) {
      setTriggeredNoMoreConfetti(true);
      const successAudio = new Audio("/success.mov");
      successAudio.volume = 0.4;
      successAudio.play().catch(() => {});
      setTimeout(() => launchConfetti(), 2000);
    }
  }, [allNo, triggeredNoMoreConfetti]);

  function answer(q: QNum, v: "yes" | "no") {
    setFlow(EMPTY_FLOW);
    setAnswers(prev => {
      if (prev[q] === v) {
        // Toggling off retracts this question and everything after it.
        const next = { ...prev };
        for (let i = q; i <= 4; i++) next[i as QNum] = null;
        return next;
      }
      const next = { ...prev };
      next[q] = v;
      for (let i = q + 1; i <= 4; i++) next[i as QNum] = null;
      return next;
    });
  }

  function restart() {
    setAnswers(EMPTY_ANSWERS);
    setFlow(EMPTY_FLOW);
    setTriggeredNoMoreConfetti(false);
  }

  function complete(step: keyof FlowProgress) {
    if (!playedSounds.has(step) && step !== "escalate") {
      playSound();
      setPlayedSounds(prev => new Set(prev).add(step));
    }
    setFlow(p => {
      if (p[step]) {
        if (step === "doc") return { ...p, doc: false, notify: false, escalate: false };
        if (step === "notify") return { ...p, notify: false, escalate: false };
        return { ...p, [step]: false };
      }
      const next = { ...p, [step]: true };
      if (step === "escalate") {
        const successAudio = new Audio("/success.mov");
        successAudio.volume = 0.4;
        successAudio.play().catch(() => {});
        setTimeout(() => launchConfetti(), 2000);
      }
      return next;
    });
  }

  function launchConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      window.confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"] });
      window.confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    setTimeout(() => {
      window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 },
        colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"] });
    }, duration);
  }

  const shared = { answers, trigger, allNo, flow, complete, answer, restart };

  return (
    <div style={{ width: "100vw", height: mobile ? "auto" : "100vh",
      minHeight: "100vh", overflow: mobile ? "visible" : "hidden",
      background: "#000", position: "relative" }}>
      {mobile ? <MobileEscalations {...shared} /> : <DesktopEscalations {...shared} />}
    </div>
  );
}

type SharedProps = {
  answers: Answers; trigger: QNum | null; allNo: boolean; flow: FlowProgress;
  complete: (step: keyof FlowProgress) => void;
  answer: (q: QNum, v: "yes" | "no") => void;
  restart: () => void;
};

// ─── Desktop: infinite pannable canvas (same camera/drag/zoom as Home) ─────
function DesktopEscalations({ answers, trigger, allNo, flow, complete, answer, restart }: SharedProps) {
  const [cam, setCam] = useState<{ x: number; y: number; z: number }>(() => {
    if (typeof window === "undefined") return { x: 0, y: 0, z: 1 };
    return {
      x: Math.round(window.innerWidth * 0.07),
      y: Math.round(window.innerHeight / 2 - CH / 2 + 28),
      z: 1,
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({ active: false, startX: 0, startY: 0, camX: 0, camY: 0 });
  const vel = useRef({ vx: 0, vy: 0, px: 0, py: 0, t: 0 });
  const raf = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-pan left as the analyst moves further into the funnel — same feel as Home.
  const autoPanX = flow.escalate ? -900 : flow.notify ? -820 : flow.doc ? -760
    : trigger ? -560 : allNo ? -560
    : answers[3] !== null ? -420 : answers[2] !== null ? -180 : 0;

  const sceneX = cam.x + autoPanX;
  const sceneY = cam.y;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, [data-no-drag]")) return;
    if (raf.current !== null) { cancelAnimationFrame(raf.current); raf.current = null; }
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, camX: cam.x, camY: cam.y };
    vel.current = { vx: 0, vy: 0, px: e.clientX, py: e.clientY, t: performance.now() };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
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
    setCam({ x: drag.current.camX + (e.clientX - drag.current.startX),
      y: drag.current.camY + (e.clientY - drag.current.startY), z: cam.z });
  }

  function onPointerUp() {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);
    let { vx, vy } = vel.current;
    const FRICTION = 0.88;
    function step() {
      vx *= FRICTION; vy *= FRICTION;
      if (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05) { raf.current = null; return; }
      setCam(c => ({ x: c.x + vx * 16, y: c.y + vy * 16, z: c.z }));
      raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
  }

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    const scrollableElement = target.closest('[style*="overflow"], [style*="overflowY"], [style*="overflowX"]');
    if (scrollableElement) {
      const cs = window.getComputedStyle(scrollableElement);
      if ((cs.overflow === "auto" || cs.overflow === "scroll" || cs.overflowY === "auto" || cs.overflowY === "scroll" || cs.overflowX === "auto" || cs.overflowX === "scroll") &&
          (scrollableElement.scrollHeight > scrollableElement.clientHeight || scrollableElement.scrollWidth > scrollableElement.clientWidth)) {
        return;
      }
    }
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(3, cam.z + delta));
    setCam(c => ({ ...c, z: newZoom }));
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault(); setCam(c => ({ ...c, z: Math.min(3, c.z + 0.2) }));
      } else if ((e.metaKey || e.ctrlKey) && e.key === "-") {
        e.preventDefault(); setCam(c => ({ ...c, z: Math.max(0.5, c.z - 0.2) }));
      } else if ((e.metaKey || e.ctrlKey) && e.key === "0") {
        e.preventDefault(); setCam(c => ({ ...c, z: 1 }));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCam]);

  useEffect(() => () => { if (raf.current !== null) cancelAnimationFrame(raf.current); }, []);

  const sharedVis = trigger !== null;

  return (
    <>
      <NavPill active="escalations" onNavigate={() => {}} />

      <div ref={canvasRef}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={handleWheel}
        style={{ position: "fixed", inset: 0, overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}>

        <div style={{ position: "absolute", top: 0, left: 0, width: CW, height: CH,
          transform: `translate(${sceneX}px, ${sceneY}px) scale(${cam.z})`,
          transition: isDragging ? "none" : "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform", transformOrigin: "0 0" }}>

          {/* ── Dotted paths ── */}
          <svg width={CW} height={CH} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
            <DimPath d={P_START} bright={true} />
            {([1, 2, 3, 4] as QNum[]).map(n => (
              <React.Fragment key={n}>
                {/* The YES branch only appears once actually chosen — otherwise it's
                    a dim line curving toward a card that isn't on screen yet. */}
                {answers[n] === "yes" && <DimPath d={YES_PATHS[n]} bright={true} />}
                {answers[n] !== null && n < 4 && <DimPath d={NO_PATHS[n]} bright={answers[n] === "no"} />}
                {n === 4 && answers[4] !== null && <DimPath d={P_Q4_NO} bright={answers[4] === "no"} />}
              </React.Fragment>
            ))}
            <AnimatePresence>
              {sharedVis && <DotPath key="doc-notify" d={P_DOC_NOTIFY} delay={0.16} />}
              {flow.doc && <DotPath key="notify-esc" d={P_NOTIFY_ESC} delay={0.16} />}
              {flow.notify && <DotPath key="esc-end" d={P_ESC_END} delay={0.16} />}
            </AnimatePresence>
          </svg>

          {/* ── Human + start label ── */}
          <div style={{ position: "absolute", left: 42, top: NODE_Y - 38 }}><Human /></div>
          <div style={{ position: "absolute", left: 8, top: NODE_Y + 44, fontFamily: "Lato,sans-serif",
            fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
            Escalating a Ticket
          </div>

          {/* ── Sequential questions ── */}
          {([1, 2, 3, 4] as QNum[]).map(n => {
            const visible = n === 1 || answers[(n - 1) as QNum] === "no";
            if (!visible) return null;
            const q = QUESTIONS[n - 1];
            return (
              <AnimatePresence key={n}>
                <React.Fragment>
                  <motion.div key={`q${n}text`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }} data-no-drag
                    style={{ position: "absolute", left: QX[n] - 30, top: NODE_Y - 45, width: 214, textAlign: "center",
                      fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 14,
                      color: "rgba(255,255,255,0.78)", cursor: "text", userSelect: "none" }}>
                    {q.text}
                  </motion.div>
                  <Btn label="No" x={QX[n] + 30} y={NO_Y - 72} chosen={answers[n] === "no"} onClick={() => answer(n, "no")} />
                  <Btn label="Yes" x={QX[n] + 30} y={YES_Y - 20} chosen={answers[n] === "yes"} onClick={() => answer(n, "yes")} />
                </React.Fragment>
              </AnimatePresence>
            );
          })}

          {/* ── No escalation criteria met yet ── */}
          <AnimatePresence>
            {allNo && (
              <motion.div key="no-more" style={{ position: "absolute", left: NO_MORE_X + 70, top: NODE_Y - 70 }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                <InfoCard width={190} title="Keep troubleshooting"
                  note="None of the escalation criteria have been met yet. Continue working the ticket." />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Shared workflow: Document → Notify → Escalate → End ── */}
          <AnimatePresence>
            {sharedVis && trigger && (
              <Node key="doc" x={DOC_X} y={SHARED_Y} label="Document Everything"
                state={flow.doc ? "done" : "idle"} onClick={() => complete("doc")} delay={0.08}
                hoverCard={<DocCard trigger={trigger} />} cardStyle={{ left: -30, top: 70 }} />
            )}
            {flow.doc && trigger && (
              <Node key="notify" x={NOTIFY_X} y={SHARED_Y} label="Notify the User"
                state={flow.notify ? "done" : "idle"} onClick={() => complete("notify")} delay={0.18}
                hoverCard={<NotifyCard />} cardStyle={{ left: -30, top: 70 }} />
            )}
            {flow.notify && trigger && (
              <Node key="escalate" x={ESC_X} y={SHARED_Y} label="Escalate the Ticket"
                state={flow.escalate ? "done" : "idle"} onClick={() => complete("escalate")} delay={0.22}
                hoverCard={<EscalateCard trigger={trigger} />} cardStyle={{ left: -30, top: 70 }} />
            )}
            {flow.escalate && <EndMarker key="end" x={END_X - 95} y={SHARED_Y - 10} delay={0.3} />}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Restart — fixed overlay ── */}
      <AnimatePresence>
        {([1, 2, 3, 4] as QNum[]).some(n => answers[n] !== null) && (
          <motion.button key="rst" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={restart}
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

// ─── Mobile: same stacked layout language as Home ──────────────────────────
function MobileEscalations({ answers, trigger, allNo, flow, complete, answer, restart }: SharedProps) {
  const visibleQ: QNum[] = ([1, 2, 3, 4] as QNum[]).filter(n => n === 1 || answers[(n - 1) as QNum] === "no");

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#000",
      overflowY: "auto", paddingTop: 136, paddingBottom: 80,
      display: "flex", flexDirection: "column", alignItems: "center" }}>

      <NavPill active="escalations" onNavigate={() => {}} />

      <div style={{ width: "100%", maxWidth: 360, padding: "0 28px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Human size={28} />
          <span style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Escalating a Ticket
          </span>
        </div>

        {visibleQ.map((n, i) => (
          <React.Fragment key={n}>
            {i > 0 && <VConnector height={30} delay={0.05} />}
            <MobileFork
              question={QUESTIONS[n - 1].text}
              yesChosen={answers[n] === "yes"} noChosen={answers[n] === "no"}
              onYes={() => answer(n, "yes")} onNo={() => answer(n, "no")}
              borderRadius="2px 8px 8px 8px" delay={i === 0 ? 0 : 0.05} />
          </React.Fragment>
        ))}

        {/* No escalation needed yet */}
        <AnimatePresence>
          {allNo && (
            <motion.div key="no-more-m" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }} style={{ marginTop: 20, width: "100%" }}>
              <InfoCard title="Keep troubleshooting"
                note="None of the escalation criteria have been met yet. Continue working the ticket." />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shared workflow */}
        <AnimatePresence>
          {trigger !== null && (
            <>
              <VConnector key="v-doc" height={30} delay={0.08} />
              <MobileNode key="doc-m" label="Document Everything"
                state={flow.doc ? "done" : "idle"} onClick={() => complete("doc")} delay={0.08}
                hoverCard={<DocCard trigger={trigger} />} />
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {flow.doc && trigger !== null && (
            <>
              <VConnector key="v-notify" height={26} delay={0.18} />
              <MobileNode key="notify-m" label="Notify the User"
                state={flow.notify ? "done" : "idle"} onClick={() => complete("notify")} delay={0.18}
                hoverCard={<NotifyCard />} />
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {flow.notify && trigger !== null && (
            <>
              <VConnector key="v-esc" height={26} delay={0.22} />
              <MobileNode key="esc-m" label="Escalate the Ticket"
                state={flow.escalate ? "done" : "idle"} onClick={() => complete("escalate")} delay={0.22}
                hoverCard={<EscalateCard trigger={trigger} />} />
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {flow.escalate && (
            <>
              <VConnector key="v-end" height={26} delay={0.3} />
              <EndMarker key="end-m" delay={0.3} />
            </>
          )}
        </AnimatePresence>

        {/* Restart */}
        <AnimatePresence>
          {([1, 2, 3, 4] as QNum[]).some(n => answers[n] !== null) && (
            <motion.button key="rst-m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={restart}
              style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
                fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 17,
                color: "rgba(255,255,255,0.38)", background: "transparent",
                border: "none", cursor: "pointer", letterSpacing: "0.06em" }}>
              ↺ restart journey
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}