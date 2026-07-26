import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

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
const P_URGENT_NO  = `M ${U_BTN_X},${U_NO_Y} C ${U_BTN_X+45},${U_NO_Y+42} ${Q2X-55},${Q2Y+76} ${Q2X},${Q2Y}`;
const P_Q2_YES     = `M ${Q2X},${Q2_YES_Y} C ${Q2X+65},${Q2_YES_Y-44} ${XW-55},${Q2_YES_Y-44} ${XW},${NODE_Y}`;
const P_Q2_NO      = `M ${Q2X},${Q2_NO_Y} C ${Q2X+20},${CY} ${XC-16},${CY} ${XC},${CY}`;
const P_CALL_WORK  = `M ${XC+12},${CY} L ${XW-12},${NODE_Y}`;
const P_WORK_DOC   = `M ${XW+12},${NODE_Y} L ${XD-12},${NODE_Y}`;
const P_DOC_Q3     = `M ${XD+12},${NODE_Y} L ${Q3X-5},${NODE_Y}`;
const P_Q3_YES     = `M ${Q3X},${Q3_YES_Y} C ${Q3X+55},${Q3_YES_Y-38} ${XE-10},${Q3_YES_Y-32} ${XE},${Q3_YES_Y-8}`;
const P_Q3_NO      = `M ${Q3X},${Q3_NO_Y} C ${Q3X+40},${EY} ${XE-20},${EY} ${XE},${EY}`;
const P_FEEDBACK_STATUS = `M ${XF+12},${Q3_YES_Y-8} L ${XS+60-75},${Q3_YES_Y-8}`;
const P_STATUS_END = `M ${XS+0+5},${Q3_YES_Y-8} C ${XS+40+56},${Q3_YES_Y-34} ${XEND-20},${Q3_YES_Y-34} ${XEND + 80},${Q3_YES_Y-8}`;const P_ESC_END = `M ${XE+12},${EY} C ${XE+105},${EY+42} ${XEND-54},${EY+42} ${XEND},${EY}`;

// ─── Shared icons ─────────────────────────────────────────────────────────────
function HomeIcon({ on }: { on: boolean }) {
  const c = on ? "#fff" : "#898989";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"
        stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TicketIcon({ on }: { on: boolean }) {
  const c = on ? "#fff" : "#898989";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="13" rx="2" stroke={c} strokeWidth="1.5" />
      <path d="M16 6V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v1" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 11v4M10 13h4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function EscIcon({ on }: { on: boolean }) {
  const c = on ? "#fff" : "#898989";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.5" />
      <path d="M4 20c0-3 3.58-6 8-6s8 3 8 6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 4l3 3-3 3M21 7h-5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavPill({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="fixed top-10 left-1/2 z-50 flex gap-[18px] items-center justify-center px-10 py-[14px]"
      style={{ transform: "translateX(-50%)", borderRadius: 60, border: "1.2px solid #E4E4E4", boxShadow: "0 1px 7px 0 white", background: "#000" }}>
      {[
        { id: "home", label: "Home", I: HomeIcon },
        { id: "work", label: "Work Ticket", I: TicketIcon },
        { id: "escalations", label: "Escalations", I: EscIcon },
      ].map(({ id, label, I }) => {
        const isHighlighted = active === id || hovered === id;

        return (
        <button key={id} onClick={() => onChange(id)}
          onMouseEnter={() => setHovered(id)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(id)}
          onBlur={() => setHovered(null)}
          className="flex flex-col items-center gap-[2px] cursor-pointer bg-transparent border-0 p-0">
          <I on={isHighlighted} />
          <span style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontWeight: 700, fontSize: 12,
            color: isHighlighted ? "#fff" : "#898989", whiteSpace: "nowrap", transition: "color 0.2s" }}>
            {label}
          </span>
        </button>
        );
      })}
    </div>
  );
}

// ─── GPS Pin ──────────────────────────────────────────────────────────────────
type PinState = "inactive" | "idle" | "active" | "done";

function GpsPin({ state, size = 20 }: { state: PinState; size?: number }) {
  const h = Math.round(size * 1.35);
  const fill = state === "inactive" ? "rgba(255,255,255,0.22)"
    : state === "done" ? "rgba(255,255,255,0.6)" : "#fff";
  const glow = state === "active"
    ? "drop-shadow(0 0 10px white) drop-shadow(0 0 20px rgba(255,255,255,0.4))"
    : state === "done" ? "drop-shadow(0 0 5px rgba(255,255,255,0.45))"
    : state === "idle" ? "drop-shadow(0 0 8px rgba(255,255,255,0.7))" : "none";
  return (
    <div style={{ filter: glow }}>
      <svg width={size} height={h} viewBox="0 0 20 27" fill="none">
        <path d="M10 0C4.477 0 0 4.477 0 10c0 6.627 10 17 10 17s10-10.373 10-17C20 4.477 15.523 0 10 0z" fill={fill} />
        <circle cx="10" cy="10" r="3.5" fill="rgba(0,0,0,0.75)" />
        {state === "done" && (
          <path d="M7.5 10L9.2 11.7L13 8" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}

function Human({ size = 40 }: { size?: number }) {
  const h = Math.round(size * 89.43 / 48.13);
  return (
    <svg width={size} height={h} viewBox="0 0 48.13 89.4301" fill="none"
      style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,1.5))" }}>
      {/* Head */}
      <path
        d="M16.4 22.12C20.1114 22.12 23.12 19.1114 23.12 15.4C23.12 11.6886 20.1114 8.68 16.4 8.68C12.6886 8.68 9.68 11.6886 9.68 15.4C9.68 19.1114 12.6886 22.12 16.4 22.12Z"
        stroke="white" strokeWidth="3.36" strokeLinecap="round" strokeLinejoin="round" />
      {/* Left body/leg */}
      <path
        d="M12.2 55.3C7.99998 44.8 10.1 34.3 15.35 31.15C20.25 44.45 20.6 59.85 16.4 77.35C15 78.75 13.25 79.1 11.15 78.4"
        stroke="white" strokeWidth="3.36" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right body/leg */}
      <path
        d="M38.45 47.95C32.85 40.95 28.65 35 25.85 30.1C23.75 49 24.8 61.6 26.9 77.35C28.3 78.75 30.05 79.1 32.15 78.4"
        stroke="white" strokeWidth="3.36" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Card shell — matches Figma Frame11 exactly ───────────────────────────────
const CARD_STYLE: React.CSSProperties = {
  background: "white",
  border: "1px solid #e4e4e4",
  borderRadius: "2px 8px 8px 8px",   // tl tr br bl — Figma asymmetric
  filter: "drop-shadow(0px 1px 3.5px white)",
  fontFamily: "Lato, sans-serif",
  padding: "16px",
  textAlign: "center",
};

const CARD_TITLE: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  fontStyle: "italic",
  color: "#023256",
  lineHeight: 1.45,
  margin: 0,
};

const CARD_DIVIDER: React.CSSProperties = {
  width: 50,
  height: 0,
  borderTop: "0.3px solid black",
  margin: "8px auto",
};

const CARD_BODY: React.CSSProperties = {
  fontSize: 11,
  fontStyle: "italic",
  color: "#023256",
  lineHeight: 1.55,
  margin: 0,
};

function InfoCard({ title, bullets, note, width = 168 }: {
  title: string; bullets?: string[]; note?: string; width?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ ...CARD_STYLE, width }}
    >
      <p style={{ ...CARD_TITLE, cursor: "text" }}>{title}</p>
      {(bullets || note) && <div style={CARD_DIVIDER} />}
      {bullets && bullets.map((b, i) => (
        <p key={i} style={{ ...CARD_BODY, cursor: "text", marginBottom: i < bullets.length - 1 ? 4 : 0 }}>{b}</p>
      ))}
      {note && <p style={{ ...CARD_BODY, cursor: "text", marginTop: bullets ? 4 : 0 }}>{note}</p>}
    </motion.div>
  );
}

// ─── Desktop-only: dotted SVG paths ──────────────────────────────────────────
function DotPath({ d, delay = 0 }: { d: string; delay?: number }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.88 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.36, delay }}>
      <path d={d} stroke="white" strokeWidth="1.6" fill="none" strokeDasharray="4 8" strokeLinecap="round" />
    </motion.g>
  );
}
function DimPath({ d, bright }: { d: string; bright: boolean }) {
  return (
    <motion.g initial={{ opacity: 0.22 }} animate={{ opacity: bright ? 0.88 : 0.22 }}
      transition={{ duration: 0.36 }}>
      <path d={d} stroke="white" strokeWidth="1.6" fill="none" strokeDasharray="4 8" strokeLinecap="round" />
    </motion.g>
  );
}

// ─── Desktop: node ────────────────────────────────────────────────────────────
function Node({ x, y, label, sublabel, state, onClick, hoverCard, cardStyle, delay = 0 }:
  { x: number; y: number; label: string; sublabel?: string; state: PinState; onClick?: () => void;
    hoverCard?: React.ReactNode; cardStyle?: React.CSSProperties; delay?: number }) {
  const [hov, setHov] = useState(false);
  const eff: PinState = hov && state === "idle" ? "active" : state;
  const col = state === "inactive" ? "rgba(255,255,255,0.24)"
    : state === "done" ? "rgba(255,255,255,0.62)" : "#fff";
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.38, delay }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
      data-no-drag
      style={{ position: "absolute", left: x - 10, top: y - 14,
        display: "flex", flexDirection: "column", alignItems: "center", cursor: onClick ? "pointer" : "default" }}>
      <motion.div
        animate={state === "active" ? { scale: [1, 1.1, 1] } : hov && state === "idle" ? { scale: 1.12 } : { scale: 1 }}
        transition={state === "active" ? { repeat: Infinity, duration: 1.7, ease: "easeInOut" } : { duration: 0.16 }}>
        <GpsPin state={eff} />
      </motion.div>
      <div style={{ marginTop: 5, textAlign: "center", cursor: "text", userSelect: "none" }}>
        <div style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 12, color: col, whiteSpace: "nowrap" }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 10, color: col, whiteSpace: "nowrap" }}>
            {sublabel}
          </div>
        )}
      </div>
      <AnimatePresence>
        {hoverCard && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
          transition={{ duration: .18 }} onClick={e => e.stopPropagation()}
          style={{ position: "absolute", zIndex: 25, ...cardStyle }}>{hoverCard}</motion.div>}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Desktop: abs-positioned branch button ────────────────────────────────────
function Btn({ label, x, y, chosen, onClick }:
  { label: string; x: number; y: number; chosen: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      animate={{ scale: hov ? 1.15 : 1 }} transition={{ duration: 0.13 }}
      style={{ position: "absolute", left: x - 16, top: y - 11, width: 34, height: 22,
        background: "transparent", border: "none", padding: 0, cursor: "pointer",
        fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 13,
        fontWeight: chosen ? 700 : 400,
        color: chosen ? "#fff" : hov ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.26)",
        transition: "color 0.16s", userSelect: "none", zIndex: 20 }}>
      {label}
    </motion.button>
  );
}

function QText({ x, y, text, infoText, infoSize, cardStyle, delay = 0 }: { x: number; y: number; text: string; infoText?: string; infoSize?: number; cardStyle?: React.CSSProperties; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay }}
      data-no-drag
      style={{ position: "absolute", left: x, top: y, fontFamily: "Lato,sans-serif",
        fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.75)",
        whiteSpace: "nowrap", cursor: "text", userSelect: "none" }}>
      {text}{infoText && <HoverInfo text={infoText} width={250} size={infoSize} cardStyle={cardStyle} />}
    </motion.div>
  );
}

function HoverInfo({ text, width = 220, size = 18, cardStyle }: { text: string; width?: number; size?: number; cardStyle?: React.CSSProperties }) {
  const [shown, setShown] = useState(false);
  const leftOffset = typeof cardStyle?.left === 'number' ? cardStyle.left + 28 : 28;
  const topOffset = typeof cardStyle?.top === 'number' ? cardStyle.top : -42;
  return (
    <span data-no-drag onMouseEnter={() => setShown(true)} onMouseLeave={() => setShown(false)}
      onFocus={() => setShown(true)} onBlur={() => setShown(false)}
      style={{ position: "relative", display: "inline-flex", marginLeft: 7, verticalAlign: "middle" }}>
      <button aria-label="More information" style={{ width: size, height: size, borderRadius: "50%", border: "none",
        padding: 0, background: "#d8d8d8", color: "#111", fontFamily: "serif", fontWeight: 700,
        fontSize: Math.round(size * .72), lineHeight: `${size}px`, cursor: "help" }}>i</button>
      <AnimatePresence>
        {shown && <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.18 }} style={{ position: "absolute", left: leftOffset, top: topOffset, zIndex: 30,
            width, padding: "14px 16px", borderRadius: "8px 8px 8px 8px", background: "#fff",
            border: "1px solid #e4e4e4", boxShadow: "0 1px 8px white", color: "#111",
            fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 12, lineHeight: 1.55,
            textAlign: "center", whiteSpace: "normal" }}>{text}</motion.span>}
      </AnimatePresence>
    </span>
  );
}

function EndMarker({ x, y, delay = 0 }: { x?: number; y?: number; delay?: number }) {
  const content = <><svg width="58" height="52" viewBox="0 0 58 52" fill="none" style={{ filter: "drop-shadow(0 0 8px white)" }} aria-label="Treasure chest">
      <path d="M8 20h42v25H8z" fill="#ffad3e" stroke="#ffad3e" strokeWidth="3" strokeLinejoin="round" />
      <path d="M11 25h36v17H11z" fill="#bc4058" />
      <path d="M6 20c5-15 35-18 46 0l-5 5H11z" fill="#ff9f32" stroke="#ffad3e" strokeWidth="3" strokeLinejoin="round" />
      <path d="M13 20c8-8 24-9 34 0H13z" fill="#bd3f57" />
      <path d="M26 20h7v25h-7z" fill="#ffd057" />
      <path d="M7 45h44l-5 5H12z" fill="#ffc146" />
      <circle cx="29.5" cy="30" r="3" fill="#ffdf65" />
      <path d="M4 43l4-2m43 2l3-2M16 48l3 2m20-2l3 2" stroke="#ffd52b" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <div style={{ marginTop: 7, fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 16, color: "rgba(255,255,255,0.78)" }}>END</div></>;
  if (x === undefined || y === undefined) return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: .35 }} style={{ textAlign: "center" }}>{content}</motion.div>;
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: .35 }} style={{ position: "absolute", left: x - 25, top: y - 30, textAlign: "center" }}>{content}</motion.div>;
}

// ─── Escalation card with copyable template dropdown ─────────────────────────
const ESCALATION_TEMPLATE =
  `Hi [Name],

I sincerely apologize for the inconvenience. To ensure you receive the best possible help, I will be escalating your ticket to our T2 team. One of their members will reach out to you quickly.

They will review everything carefully and follow up with you shortly.

Thank you for your patience and understanding.`;

function EscalationCard({ compact: _compact }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function copy() {
    try {
      const ta = document.createElement("textarea");
      ta.value = ESCALATION_TEMPLATE;
      ta.style.cssText = "position:fixed;top:-999px;left:-999px;opacity:0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // silently fail
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ ...CARD_STYLE, width: 168, marginLeft: "15px", marginTop: "5px"}}>

      <p style={{ ...CARD_TITLE, cursor: "text"}}>Leave notes on everything you did and why you are escalating</p>
      <div style={CARD_DIVIDER} />
      <p style={{ ...CARD_BODY, cursor: "text" }}>Exceeding 40 min, lack of knowledge or tool access</p>

      {/* Template toggle */}
      <button onClick={() => setOpen(o => !o)}
        style={{ marginTop: 10, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 5,
          width: "100%", background: "#f1f1f1", border: "none", borderRadius: 6,
          padding: "5px 9px", cursor: "pointer", fontFamily: "Lato,sans-serif",
          fontSize: 10, color: "#023256", fontStyle: "italic" }}>
        <span>Use template</span>
        <span style={{ fontSize: 7, display: "inline-block", transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div key="tpl"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}>
            <div style={{ marginTop: 7, background: "#f0f4f8", borderRadius: 6,
              padding: "7px 9px", fontSize: 9.5, color: "#023256", lineHeight: 1.65,
              whiteSpace: "pre-wrap", fontStyle: "italic", textAlign: "left",
              maxHeight: 120, overflowY: "auto", cursor: "text" }}>
              {ESCALATION_TEMPLATE}
            </div>
            <button onClick={copy}
              style={{ marginTop: 6, width: "100%",
                background: copied ? "#16a34a" : "#023256",
                color: "white", border: "none", borderRadius: 6, padding: "5px 0",
                fontSize: 10, fontFamily: "Lato,sans-serif", cursor: "pointer",
                transition: "background 0.22s", fontStyle: "italic" }}>
              {copied ? "✓ Copied!" : "Copy to clipboard"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Mobile-only components ───────────────────────────────────────────────────
function VConnector({ delay = 0, height = 40 }: { delay?: number; height?: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }}
      transition={{ duration: 0.3, delay }}
      style={{ display: "flex", justifyContent: "center", padding: "2px 0" }}>
      <svg width="2" height={height} viewBox={`0 0 2 ${height}`}>
        <line x1="1" y1="0" x2="1" y2={height}
          stroke="white" strokeWidth="1.5" strokeDasharray="3 6" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

function MobileNode({ label, sublabel, state, onClick, hoverCard, delay = 0 }:
  { label: string; sublabel?: string; state: PinState; onClick?: () => void; hoverCard?: React.ReactNode; delay?: number }) {
  const [hov, setHov] = useState(false);
  const col = state === "inactive" ? "rgba(255,255,255,0.3)"
    : state === "done" ? "rgba(255,255,255,0.65)" : "#fff";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.38, delay }}
      onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: onClick ? "pointer" : "default", position: "relative" }}>
      <motion.div
        animate={state === "active" ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={state === "active" ? { repeat: Infinity, duration: 1.7, ease: "easeInOut" } : {}}>
        <GpsPin state={state} size={24} />
      </motion.div>
      <span style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic",
        fontSize: 13, color: col, textAlign: "center" }}>
        {label}
      </span>
      {sublabel && (
        <span style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic",
          fontSize: 11, color: col, textAlign: "center", marginTop: -4 }}>
          {sublabel}
        </span>
      )}
      <AnimatePresence>{hoverCard && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: "absolute", zIndex: 10, top: 62 }}>{hoverCard}</motion.div>}</AnimatePresence>
    </motion.div>
  );
}

function MobileFork({ question, infoText, yesChosen, noChosen, onYes, onNo, delay = 0 }:
  { question: string; infoText?: string; yesChosen: boolean; noChosen: boolean;
    onYes: () => void; onNo: () => void; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.38, delay }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <p style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 13,
        color: "rgba(255,255,255,0.78)", textAlign: "center", margin: 0 }}>
        {question}{infoText && <HoverInfo text={infoText} width={210} />}
      </p>
      <div style={{ display: "flex", gap: 36 }}>
        {[
          { label: "Yes", chosen: yesChosen, onClick: onYes },
          { label: "No",  chosen: noChosen,  onClick: onNo  },
        ].map(({ label, chosen, onClick }) => (
          <motion.button key={label} onClick={onClick}
            whileTap={{ scale: 0.92 }}
            style={{ background: chosen ? "rgba(255,255,255,0.12)" : "transparent",
              border: chosen ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.15)",
              borderRadius: 20, padding: "6px 22px",
              fontFamily: "Lato,sans-serif", fontStyle: "italic",
              fontSize: 13, fontWeight: chosen ? 700 : 400,
              color: chosen ? "#fff" : "rgba(255,255,255,0.38)",
              cursor: "pointer", transition: "all 0.18s" }}>
            {label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

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

      <NavPill active={tab} onChange={setTab} />

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
              onYes={() => pickUrgent("yes")} onNo={() => pickUrgent("no")} />
          )}
        </AnimatePresence>

        {/* Q2 fork */}
        <AnimatePresence>
          {q2Open && (
            <MobileFork key={`q2-${vip}`}
              question="Is the information provided enough?"
              yesChosen={info === "yes"} noChosen={info === "no"}
              onYes={() => pickInfo("yes")} onNo={() => pickInfo("no")}
              delay={vip === "yes" ? 0.22 : 0.1} />
          )}
        </AnimatePresence>

        {/* 5Ws card + Call user (NO at Q2) */}
        <AnimatePresence>
          {false && info === "no" && (
            <>
              <VConnector key={`v-call-${info}`} delay={d.call} height={28} />
              <MobileNode key={`call-${info}`} label="Call the user" state={progress.call ? "done" : "idle"} onClick={() => complete("call")} delay={d.call}
                hoverCard={<InfoCard title="Gather more information using 5 Ws" bullets={["1. Let user know you are legitimate by saying the Word of the Day", "Most Important: Do Caller Verify"]} />} />
              <motion.div key={`call-card-${info}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.35, delay: d.cw }}
                style={{marginTop: 12, width: "100%" }}>
                <InfoCard 
                  title="Gather more information using 5 Ws"
                  bullets={[
                    "1. Let user know you are legitimate by saying the Word of the Day",
                    "Most Important: 2. Do Caller Verify",
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
                hoverCard={<InfoCard title="Write everything you did to solve the issue in bullet points. You can call the user to confirm what you did to solve issue (optional)" bullets={["1. They should be internal notes", "2. Screenshots are encouraged!"]} />} />
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
              <p style={{ margin: "-3px 0 0", color: "rgba(255,255,255,0.72)", fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 12, textAlign: "center" }}>Leave the ticket status in “Open”</p>
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
              style={{ marginTop: 36, fontFamily: "Lato,sans-serif", fontStyle: "italic",
                fontSize: 15, color: "rgba(255,255,255,0.38)", background: "transparent",
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
  // Future zoom: add { z: 1 } and multiply into transform
  const [cam, setCam] = useState<{ x: number; y: number }>(() => {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    return {
      x: Math.round(window.innerWidth * 0.09),
      y: Math.round(window.innerHeight / 2 - CH / 2 + 28),
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
      setCam(c => ({ x: c.x + vx * 16, y: c.y + vy * 16 }));
      raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
  }

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
      <NavPill active={tab} onChange={setTab} />

      {/* ── Infinite canvas viewport ── */}
      <div
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: "fixed", inset: 0,
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab",
          // Touch: prevent default browser scroll so we can pan
          touchAction: "none",
        }}
      >
        {/* ── World container: camera transform applied here ── */}
        {/* To add zoom later: append  scale(${cam.z})  to the transform string */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: CW,
            height: CH,
            transform: `translate(${sceneX}px, ${sceneY}px)`,
            // Smooth transition for auto-pan advances; instant while dragging
            transition: isDragging
              ? "none"
              : "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
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
                  fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 13,
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
              infoSize={13} delay={0.08} />}
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
              hoverCard={<InfoCard title="Take it no matter the order" bullets={["VIP Queue always has priority"]} />}
              cardStyle={{ left: -48, top: -115 }} />}
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
              hoverCard={<InfoCard title="Gather more information using 5 Ws" bullets={["1. Let user know you are legitimate by saying the Word of the Day", "2. Most Important: Do Caller Verify"]} />}
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
                hoverCard={<InfoCard width={170} title="Write everything you did as an internal note and in bullet points. Call the user to confirm what you did to solve issue (optional)" bullets={["1. They should be internal notes", "2. Screenshots are encouraged!"]} />}
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
              <QText key="feedback-info" x={XF + 32} y={Q3_YES_Y + 30}
                text=""
                infoText="Higgy is our AI assistant that helps us understand tickets better."
                infoSize={13} delay={0.08} cardStyle={{ left: -20, top: 25}} />
              {progress.feedback && <Node key="status-solved" x={XS + 20} y={Q3_YES_Y - 8} label={'Change ticket status from “Open”'} sublabel={'to “Solved”'}
                state={progress.status ? "done" : "idle"} onClick={() => complete("status")} delay={0.22} />}
              {progress.status && <EndMarker x={XEND} y={Q3_YES_Y - 8} delay={0.38} />}
            </>}
            {escVis && <>
              <Node key="escalate-case" x={XS} y={EY} label="Escalate Case" state={progress.escalate ? "done" : "idle"} onClick={() => complete("escalate")} delay={0.14} />
              <QText key="open-status" x={XS - 74} y={EY + 45} text={'Leave the ticket status in “Open”'} delay={0.25} />
              {progress.escalate && <EndMarker x={XEND} y={EY} delay={0.42} />}
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
            style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)",
              fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 15,
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
  const [tab, setTab]     = useState("home");
  const [vip, setVip]     = useState<Branch>(null);
  const [urgent, setUrgent] = useState<Branch>(null);
  const [info, setInfo]   = useState<Branch>(null);
  const [fixed, setFixed] = useState<Branch>(null);
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [mobile, setMobile] = useState(false);

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
      return { ...p, [step]: true };
    });
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
