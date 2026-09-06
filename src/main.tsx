
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import App from "./app/App.tsx";
  import { WorkTicketPage } from "./features/work-ticket/WorkTicketPage";
  import { EscalationsPage } from "./features/escalations/EscalationsPage";
  import TemplatesPage from "./features/templates/TemplatesPage";
  import ITTeamPage from "./features/it-team/ITTeamPage";
  import RetroComputerPage from "./features/commands/RetroComputerPage";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/work-ticket" element={<WorkTicketPage />} />
        <Route path="/escalations" element={<EscalationsPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/it-team" element={<ITTeamPage />} />
        <Route path="/commands" element={<RetroComputerPage />} />
      </Routes>
    </BrowserRouter>
  );
  