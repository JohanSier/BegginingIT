import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomeIcon({ on }: { on: boolean }) {
  const c = on ? "#fff" : "#898989";
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"
        stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TicketIcon({ on }: { on: boolean }) {
  const c = on ? "#fff" : "#898989";
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "2px" }}>
      <rect x="3" y="4" width="18" height="12" rx="2" stroke={c} strokeWidth="1.5" />
      <path d="M8 21h8M12 16v4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EscIcon({ on }: { on: boolean }) {
  const c = on ? "#fff" : "#898989";
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.5" />
      <path d="M4 20c0-3 3.58-6 8-6s8 3 8 6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 4l3 3-3 3M21 7h-5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NavPill({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    if (id === "work") {
      navigate("/work-ticket");
    } else if (id === "home") {
      navigate("/");
    } else {
      onNavigate(id);
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 z-50 flex gap-[25px] items-center justify-center px-12 py-[16px]"
      style={{ transform: "translateX(-50%)", borderRadius: 60, border: "1.2px solid #E4E4E4", boxShadow: "0 1px 7px 0 white", background: "#000" }}>
      {[
        { id: "home", label: "Home", I: HomeIcon },
        { id: "work", label: "Work Ticket", I: TicketIcon },
        { id: "escalations", label: "Escalations", I: EscIcon },
      ].map(({ id, label, I }) => {
        const isHighlighted = active === id || hovered === id;

        return (
        <button key={id} onClick={() => handleClick(id)}
          onMouseEnter={() => setHovered(id)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(id)}
          onBlur={() => setHovered(null)}
          className="flex flex-col items-center gap-[2px] cursor-pointer bg-transparent border-0 p-0"
          style={{ marginLeft: id === "home" ? "4px" : id === "work" ? "8px" : "0", marginRight: id === "escalations" ? "4px" : "0" }}>
          <I on={isHighlighted} />
          <span style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontWeight: 700, fontSize: 14,
            color: isHighlighted ? "#fff" : "#898989", whiteSpace: "nowrap", transition: "color 0.2s" }}>
            {label}
          </span>
        </button>
        );
      })}
    </div>
  );
}