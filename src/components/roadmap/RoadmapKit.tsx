import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Shared visual language for the pannable-canvas roadmap style ────────────
// Extracted from the Home page so other sections (e.g. Escalations) can reuse
// the exact same cards, pins, dotted paths, and animation timing.

export type PinState = "inactive" | "idle" | "active" | "done";

// ─── GPS Pin ──────────────────────────────────────────────────────────────────
export function GpsPin({ state, size = 20 }: { state: PinState; size?: number }) {
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

export function Human({ size = 40 }: { size?: number }) {
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
export const CARD_STYLE: React.CSSProperties = {
  background: "white",
  border: "1px solid #e4e4e4",
  borderRadius: "2px 8px 8px 8px",   // tl tr br bl — Figma asymmetric
  filter: "drop-shadow(0px 1px 3.5px white)",
  fontFamily: "Lato, sans-serif",
  padding: "16px",
  textAlign: "center",
};

export const CARD_TITLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  fontStyle: "italic",
  color: "#023256",
  lineHeight: 1.45,
  margin: 0,
};

export const CARD_DIVIDER: React.CSSProperties = {
  width: 50,
  height: 0,
  borderTop: "0.3px solid black",
  margin: "8px auto",
};

export const CARD_BODY: React.CSSProperties = {
  fontSize: 13,
  fontStyle: "italic",
  color: "#023256",
  lineHeight: 1.55,
  margin: 0,
};

export function InfoCard({ title, bullets, note, width = 168, style }: {
  title: string; bullets?: string[]; note?: string; width?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ ...CARD_STYLE, width, ...style }}
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
export function DotPath({ d, delay = 0 }: { d: string; delay?: number }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.88 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.36, delay }}>
      <path d={d} stroke="white" strokeWidth="1.6" fill="none" strokeDasharray="4 8" strokeLinecap="round" />
    </motion.g>
  );
}
export function DimPath({ d, bright }: { d: string; bright: boolean }) {
  return (
    <motion.g initial={{ opacity: 0.22 }} animate={{ opacity: bright ? 0.88 : 0.22 }}
      transition={{ duration: 0.36 }}>
      <path d={d} stroke="white" strokeWidth="1.6" fill="none" strokeDasharray="4 8" strokeLinecap="round" />
    </motion.g>
  );
}

// ─── Desktop: node ────────────────────────────────────────────────────────────
export function Node({ x, y, label, sublabel, state, onClick, hoverCard, cardStyle, delay = 0 }:
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
        <div style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 14, color: col, whiteSpace: "nowrap" }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 14, color: col, whiteSpace: "nowrap" }}>
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
export function Btn({ label, x, y, chosen, onClick }:
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

export function QText({ x, y, text, infoText, infoSize, cardStyle, borderRadius, delay = 0 }: { x: number; y: number; text: string; infoText?: string; infoSize?: number; cardStyle?: React.CSSProperties; borderRadius?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay }}
      data-no-drag
      style={{ position: "absolute", left: x, top: y, fontFamily: "Lato,sans-serif",
        fontStyle: "italic", fontSize: 15, color: "rgba(255,255,255,0.75)",
        whiteSpace: "nowrap", cursor: "text", userSelect: "none" }}>
      {text}{infoText && <HoverInfo text={infoText} width={250} size={infoSize} cardStyle={cardStyle} borderRadius={borderRadius} />}
    </motion.div>
  );
}

export function HoverInfo({ text, width = 220, size = 18, cardStyle, borderRadius }: { text: string; width?: number; size?: number; cardStyle?: React.CSSProperties; borderRadius?: string }) {
  const [shown, setShown] = useState(false);
  const leftOffset = typeof cardStyle?.left === 'number' ? cardStyle.left + 28 : 28;
  const topOffset = typeof cardStyle?.top === 'number' ? cardStyle.top : -42;
  const radius = borderRadius || "8px 8px 8px 8px";
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
            width, padding: "14px 16px", borderRadius: radius, background: "#fff",
            border: "1px solid #e4e4e4", boxShadow: "0 1px 8px white", color: "#111",
            fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 14, lineHeight: 1.55,
            textAlign: "center", whiteSpace: "normal" }}>{text}</motion.span>}
      </AnimatePresence>
    </span>
  );
}

export function EndMarker({ x, y, delay = 0 }: { x?: number; y?: number; delay?: number }) {
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
    <div style={{ marginTop: 7, fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 18, color: "rgba(255,255,255,0.78)" }}>END</div></>;
  if (x === undefined || y === undefined) return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: .35 }} style={{ textAlign: "center" }}>{content}</motion.div>;
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: .35 }} style={{ position: "absolute", left: x + 105, top: y - 20, textAlign: "center" }}>{content}</motion.div>;
}

// ─── Escalation card with copyable template dropdown ─────────────────────────
export const ESCALATION_TEMPLATE =
  `Hi [Name],

I sincerely apologize for the inconvenience. To ensure you receive the best possible help, I will be escalating your ticket to our T2 team. One of their members will reach out to you quickly.

They will review everything carefully and follow up with you shortly.

Thank you for your patience and understanding.`;

export function EscalationCard({ compact: _compact }: { compact?: boolean }) {
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
      style={{ ...CARD_STYLE, width: 168, marginLeft: "25px", marginTop: "10px"}}>

      <p style={{ ...CARD_TITLE, cursor: "text"}}>Leave notes on everything you did and why you are escalating</p>
      <div style={CARD_DIVIDER} />
      <p style={{ ...CARD_BODY, cursor: "text" }}>Reaching an hour without a solution, lack of knowledge or tool access</p>

      {/* Template toggle */}
      <button onClick={() => setOpen(o => !o)}
        style={{ marginTop: 10, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 5,
          width: "100%", background: "#f1f1f1", border: "none", borderRadius: 6,
          padding: "5px 9px", cursor: "pointer", fontFamily: "Lato,sans-serif",
          fontSize: 12, color: "#023256", fontStyle: "italic" }}>
        <span>Use template</span>
        <span style={{ fontSize: 9, display: "inline-block", transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div key="tpl"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}>
            <div style={{ marginTop: 7, background: "#f0f4f8", borderRadius: 6,
              padding: "7px 9px", fontSize: 11.5, color: "#023256", lineHeight: 1.65,
              whiteSpace: "pre-wrap", fontStyle: "italic", textAlign: "left",
              maxHeight: 120, overflowY: "auto", cursor: "text" }}>
              {ESCALATION_TEMPLATE}
            </div>
            <button onClick={copy}
              style={{ marginTop: 6, width: "100%",
                background: copied ? "#16a34a" : "#023256",
                color: "white", border: "none", borderRadius: 6, padding: "5px 0",
                fontSize: 12, fontFamily: "Lato,sans-serif", cursor: "pointer",
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
export function VConnector({ delay = 0, height = 40 }: { delay?: number; height?: number }) {
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

export function MobileNode({ label, sublabel, state, onClick, hoverCard, delay = 0 }:
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
        fontSize: 15, color: col, textAlign: "center" }}>
        {label}
      </span>
      {sublabel && (
        <span style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic",
          fontSize: 15, color: col, textAlign: "center" }}>
          {sublabel}
        </span>
      )}
      <AnimatePresence>{hoverCard && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: "absolute", zIndex: 10, top: 62 }}>{hoverCard}</motion.div>}</AnimatePresence>
    </motion.div>
  );
}

export function MobileFork({ question, infoText, yesChosen, noChosen, onYes, onNo, borderRadius, delay = 0 }:
  { question: string; infoText?: string; yesChosen: boolean; noChosen: boolean;
    onYes: () => void; onNo: () => void; borderRadius?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.38, delay }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <p style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontSize: 15,
        color: "rgba(255,255,255,0.78)", textAlign: "center", margin: 0 }}>
        {question}{infoText && <HoverInfo text={infoText} width={210} borderRadius={borderRadius} />}
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
              fontSize: 15, fontWeight: chosen ? 700 : 400,
              color: chosen ? "#fff" : "rgba(255,255,255,0.38)",
              cursor: "pointer", transition: "all 0.18s" }}>
            {label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
