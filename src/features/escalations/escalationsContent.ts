// ─── Escalations content ──────────────────────────────────────────────────
// The flow is a funnel, not four independent branches: four sequential
// questions, and a YES answer to any of them drops into the SAME shared
// Document → Notify → Escalate workflow. Only the trigger (which question
// fired) changes — so the copy below stays context-aware while the visual
// nodes stay singular.

export type QNum = 1 | 2 | 3 | 4;

export const QUESTIONS: { n: QNum; text: string }[] = [
  { n: 1, text: "Have you worked on this ticket for more than 45 - 50 minutes without meaningful progress?" },
  { n: 2, text: "Does this ticket require a Field Services Technician?" },
  { n: 3, text: "Does this ticket require a Tier 2 Technician?" },
  { n: 4, text: "Does this ticket require a Business Systems Technician?" },
];

// Destination team the ticket gets escalated to, depending on which
// question triggered the shared workflow.
export const DESTINATION: Record<QNum, string> = {
  1: "Tier 2",
  2: "Field Services",
  3: "Tier 2",
  4: "Business Systems",
};

// Context-aware body text for the single shared "Document Everything" card.
export const DOC_BULLETS: Record<QNum, string[]> = {
  1: [
    "List every troubleshooting step you've already tried",
    "Add screenshots of what you've checked",
  ],
  2: [
    "Note the physical hardware observations you made",
    "Include what you tested or ruled out on-site or by phone",
  ],
  3: [
    "Document every diagnostic step already completed",
    "Include the exact error messages and screenshots",
  ],
  4: [
    "Capture application-specific detail (module, exact error)",
    "Include any Epic-related information if relevant",
  ],
};

export const DOC_NOTE: Record<QNum, string> = {
  1: "This avoids duplicate work once Tier 2 picks it up.",
  2: "This gives Field Services what they need before they arrive.",
  3: "This lets Tier 2 continue instead of starting over.",
  4: "This gives Business Systems the context to act fast.",
};
