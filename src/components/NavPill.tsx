import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "1px" }}>
      <rect x="3" y="4" width="18" height="12" rx="2" stroke={c} strokeWidth="1.5" />
      <path d="M8 21h8M12 16v4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
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

function TemplatesIcon({ on }: { on: boolean }) {
  const c = on ? "#fff" : "#898989";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ITTeamIcon({ on }: { on: boolean }) {
  const c = on ? "#fff" : "#898989";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {/* Main person */}
      <circle cx="12" cy="7" r="3" stroke={c} strokeWidth="1.5" />
      <path d="M5 21c0-2.21 3.58-4 7-4s7 1.79 7 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      {/* Second person (smaller, behind) */}
      <circle cx="18" cy="6" r="2" stroke={c} strokeWidth="1.5" opacity="0.7" />
      <path d="M18 10c-1.5 0-2.8 0.5-3.8 1.3" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* Third person (smaller, behind) */}
      <circle cx="6" cy="6" r="2" stroke={c} strokeWidth="1.5" opacity="0.7" />
      <path d="M6 10c1.5 0 2.8 0.5 3.8 1.3" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function CommandsIcon({ on }: { on: boolean }) {
  const c = on ? "#fff" : "#898989";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 17l6-6-6-6M12 19h8" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NavPill({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isCommandsVisible, setIsCommandsVisible] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const scheduleClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setIsCommandsVisible(false);
      setHovered(null);
    }, 500);
  };

  const cancelClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  };

  const handleClick = (id: string) => {
    if (id === "work") {
      navigate("/work-ticket");
    } else if (id === "home") {
      navigate("/");
    } else if (id === "escalations") {
      navigate("/escalations");
    } else if (id === "templates") {
      navigate("/templates");
    } else if (id === "it-team") {
      navigate("/it-team");
    } else if (id === "commands") {
      navigate("/commands");
    } else {
      onNavigate(id);
    }
  };

  return (
    <nav
      className="fixed bottom-20 left-1/2 z-50 flex gap-[18px] items-center justify-center px-6 py-[12px]"
      style={{ transform: "translateX(-50%)", borderRadius: 60, border: "1.2px solid #E4E4E4", boxShadow: "0 1px 7px 0 white", background: "#000" }}
    >
      {[
        { id: "home", label: "Home", I: HomeIcon },
        { id: "work", label: "Work Ticket", I: TicketIcon },
        { id: "escalations", label: "Escalations", I: EscIcon },
        ...(active === 'commands' 
          ? [{ id: "commands", label: "Commands", I: CommandsIcon }]
          : [{ id: "templates", label: "Templates", I: TemplatesIcon }]
        ),
        { id: "it-team", label: "IT Team", I: ITTeamIcon },
      ].map(({ id, label, I }) => {
        const isHighlighted = active === id || hovered === id;
        const isActive = active === id;
        const isSwappable = id === 'templates' || id === 'commands';

        const navigationButton = (
          <button
            onClick={() => handleClick(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(id)}
            onBlur={() => setHovered(null)}
            className="flex flex-col items-center gap-[1px] cursor-pointer border-0 p-0"
            style={{
              marginLeft: id === "home" ? "2px" : id === "work" ? "4px" : "0",
              marginRight: id === "it-team" ? "2px" : "0",
              background: isActive ? "rgba(255,255,255,0.12)" : "none",
              borderRadius: 40,
              padding: "5px 10px",
              transition: "color 0.2s ease, background 0.2s ease",
            }}
          >
            <I on={isHighlighted} />
            <span style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontWeight: 700, fontSize: 12,
              color: isHighlighted ? "#fff" : "#898989", whiteSpace: "nowrap", transition: "color 0.2s" }}>
              {label}
            </span>
          </button>
        );

        if (!isSwappable) return <div key={id}>{navigationButton}</div>;

        const dropdownId = active === 'commands' ? 'templates' : 'commands';
        const dropdownLabel = active === 'commands' ? 'Templates' : 'Commands';
        const dropdownIcon = active === 'commands' ? TemplatesIcon : CommandsIcon;
        const DropdownIcon = dropdownIcon;

        return (
          <div 
            className="swappable-nav-anchor" 
            key={id} 
            style={{ position: 'relative', display: 'flex' }}
            onMouseEnter={() => { setHovered(id); setIsCommandsVisible(true); cancelClose(); }}
            onMouseLeave={scheduleClose}
          >
            {navigationButton}
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 25px)',
                left: '50%',
                opacity: isCommandsVisible ? 1 : 0,
                pointerEvents: isCommandsVisible ? 'auto' : 'none',
                transform: isCommandsVisible ? 'translate(-50%, 0)' : 'translate(-50%, 8px)',
                transformOrigin: 'center bottom',
                transition: 'opacity .18s ease, transform .24s cubic-bezier(.16, 1, .3, 1)',
              }}
            >
              <button
                type="button"
                onClick={() => handleClick(dropdownId)}
                onMouseEnter={() => { setHovered(dropdownId); cancelClose(); }}
                onMouseLeave={scheduleClose}
                onFocus={() => { setHovered(dropdownId); cancelClose(); }}
                onBlur={scheduleClose}
                className="flex flex-col items-center gap-[1px] cursor-pointer border-0 p-0"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 40,
                  padding: "5px 15px",
                  transition: "color 0.2s ease, background 0.2s ease",
                }}
              >
                <DropdownIcon on={active === dropdownId || hovered === dropdownId} />
                <span style={{ fontFamily: "Lato,sans-serif", fontStyle: "italic", fontWeight: 700, fontSize: 12,
                  color: (active === dropdownId || hovered === dropdownId) ? "#fff" : "#898989", whiteSpace: "nowrap", transition: "color 0.2s" }}>
                  {dropdownLabel}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </nav>
  );
}