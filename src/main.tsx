
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import App from "./app/App.tsx";
  import { WorkTicketPage } from "./features/work-ticket/WorkTicketPage";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/work-ticket" element={<WorkTicketPage />} />
      </Routes>
    </BrowserRouter>
  );
  