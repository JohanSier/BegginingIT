import { NavPill } from "../../components/NavPill";

export default function ITTeamPage() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          fontFamily: "'Lato', sans-serif",
          fontStyle: "italic",
          fontSize: 18,
          letterSpacing: "0.9px",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        IT Team — coming soon
      </p>
      <NavPill active="it-team" onNavigate={() => {}} />
    </div>
  );
}
