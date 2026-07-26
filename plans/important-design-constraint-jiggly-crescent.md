# Context

Build an interactive, animated helpdesk workflow explorer ("Compass") that faithfully implements the Figma mockups. The mockups show a minimal, immersive dark-canvas experience where a support agent navigates a branching decision tree — not a dashboard. The workflow is the interface.

Two screens were provided (MacBookPro144 and MacBookPro145), showing the same canvas at different scroll positions / branch states. The design language is:
- Pure black background
- Centered glowing navigation pill (Home / Work Ticket / Escalations) — Lato Bold Italic, white border + white glow
- Horizontal left-to-right workflow with YES (upper) / NO (lower) branches
- Location-pin nodes (white, glowing) connected by animated dashed lines
- White floating info cards that appear only when a branch is chosen
- Italic small text for Yes/No labels and step names
- Human figure icon at workflow start
- Massive negative space — nothing fills the canvas except the workflow itself

---

# Design Language Principles Inferred

1. **Black canvas is structural** — not a background, it's the environment
2. **Every element earns its place** — nothing decorative, nothing extra
3. **Workflow nodes are GPS pins** — the white location-pin SVG with white drop-shadow glow
4. **Connections are dotted animated paths** — "marching ants" SVG stroke-dashoffset animation
5. **Cards are white, floating, rounded** — appear only when a branch activates
6. **Nav pill is the only persistent UI chrome** — centered top, pill-shaped, white border glow
7. **Font is Lato** — Bold Italic for nav labels, Italic for node labels and questions, small scale (~12px nav)
8. **Four interaction states per node**: inactive (gray), hover (white glow + scale), active (pulse), completed (checkmark + softer glow)
9. **Branches animate in/out** — inactive branch fades and shrinks, active branch draws itself in
10. **Camera subtly pans** — CSS transform on canvas container scrolls right as choices are made

---

# Workflow Data Structure

```
START → Human figure
Q1: "Is Ticket in VIP queue?"
  YES → [Analyze Information node]  (card: "Take it no matter the order / VIP Queue always has priority")
        → Q2: "Is the information provided enough?"
          YES → [Work the Ticket node] → [Document Everything node] → Q3
          NO  → [Call the user node]   (card: "Gather more information using 5 Ws / Let user know you are legitimate / Most Important: Do Caller Verify")
                → [Work the Ticket node] → [Document Everything node] → Q3
  NO  → same path as YES above (Q2 directly)

Q3: "Did the issue get fixed?"
  YES → (card: "Write everything you did to try to solve issue, write everything in bullet points / There would be internal notes / Make Screenshots!")
  NO  → [Let user know you'll escalate it node]
        (card: "Leave on the notes everything you did and why you are escalating ticket / Could be due exceeding the 40 minutes working the ticket, lack of knowledge or tool access / Template: [Template]")
```

Simplified: the YES path on VIP skips a step but merges at the same Q2 checkpoint. Treat both VIP answers as reaching Q2; the VIP YES card is the only divergence.

---

# Implementation Plan

## Files to modify

1. **`src/styles/fonts.css`** — Add Google Fonts import for Lato (400 italic, 700, 700 italic)
2. **`src/styles/theme.css`** — Override `--background` → `#000000`, `--foreground` → `#ffffff` in `:root`
3. **`src/app/App.tsx`** — Full implementation (single file, self-contained)

## App.tsx Architecture

### State
```ts
type Branch = "yes" | "no" | null
const [vip, setVip] = useState<Branch>(null)       // Q1
const [info, setInfo] = useState<Branch>(null)     // Q2
const [fixed, setFixed] = useState<Branch>(null)   // Q3
const [activeTab, setActiveTab] = useState("work") // nav
```

### Layout
- Root: `w-screen h-screen bg-black overflow-hidden relative`
- Navigation pill: `fixed top-6 left-1/2 -translate-x-1/2 z-50` — pill with `border border-white/70 shadow-[0_1px_7px_0_white]`
- Canvas container: `absolute inset-0` with CSS transform `translateX` that pans left as workflow progresses, animated via `motion/react`
- Workflow content: `absolute` positioned at a large coordinate space (e.g. 2400×800 virtual canvas), centered vertically at `top-1/2`

### Components (all in App.tsx)

**`<NavPill>`** — exact replica of Frame8 import: 3 nav items (Home, Work Ticket, Escalations) with SVG icons, Lato Bold Italic labels, pill border with white glow. Active state: brighter text + icon.

**`<WorkflowNode>`** — GPS pin SVG (location marker shape) with:
- 4 states driven by props: `state: "inactive" | "hover" | "active" | "completed"`
- inactive: `opacity-40 text-white/40`
- hover: white glow `drop-shadow(0 0 10px white)` + `scale-110`
- active: white, pulse keyframe animation
- completed: checkmark overlay, softer glow

**`<DottedConnection>`** — SVG `<path>` with:
- `stroke-dasharray="6 8"` white stroke
- Active state: CSS animation `@keyframes march { stroke-dashoffset: -28 }` continuous
- Draw-in animation: `pathLength` 0→1 via motion/react `animate`
- Inactive: `opacity-30`, no animation

**`<InfoCard>`** — white rounded card (`bg-white text-gray-900 rounded-xl p-4 shadow-2xl`):
- Appears with `motion/react`: `initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}` 300ms ease
- Disappears with `exit={{ opacity: 0, y: 8 }}`
- Wraps in `<AnimatePresence>` from `motion/react`

**`<BranchChoice>`** — the YES/NO clickable text labels with curved dotted SVG path leading to them:
- Lato Italic, small (~11px)
- Gray when inactive, white when hovered, bright white + underline when active/selected
- Cursor pointer

**`<HumanFigure>`** — inline SVG stick figure matching the mockup (simple: circle head + body lines)

### Coordinate Layout (virtual canvas, pixels)

All elements positioned `absolute` within a 2400×600 virtual canvas, vertically centered:

```
x=80   Human figure + Q1 text "Is Ticket in VIP queue?"
x=200  YES branch upper: Analyze Information node + VIP card above
x=440  Q2 node: "Is the information provided enough?"
x=560  NO branch lower: Call the user node + info card below
x=680  Work the Ticket node
x=820  Document Everything node
x=920  Q3 text "Did the issue get fixed?"
x=1040 YES branch upper: completion card
x=1040 NO branch lower: Escalate node + escalation card
```

Vertical baseline: y=300 (center of canvas)
YES branches: y=200 (100px above baseline)
NO branches: y=400 (100px below baseline)

### Camera Pan
As decisions are made, compute `targetX` offset:
- No choices: `translateX(0)`
- VIP answered: `translateX(-150px)`
- Info answered: `translateX(-350px)`
- Fixed answered: `translateX(-550px)`

Animate with `motion/react` `animate={{ x: -offset }}` with `spring` physics.

### Connection Paths
SVG overlay covering full virtual canvas. Paths drawn as cubic bezier curves connecting nodes. Each path conditionally rendered based on state, with `AnimatePresence` for smooth removal.

### CSS Keyframes (in App.tsx via `<style>` tag or tailwind arbitrary)
```css
@keyframes march { to { stroke-dashoffset: -28; } }
@keyframes pulse-glow { 0%,100% { filter: drop-shadow(0 0 6px white); } 50% { filter: drop-shadow(0 0 16px white); } }
```

---

# Fonts

`src/styles/fonts.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap');
```

---

# Theme Changes

`src/styles/theme.css` `:root` block:
- `--background: #000000`
- `--foreground: #ffffff`
- `--border: rgba(255,255,255,0.15)`

---

# Verification

1. Open the app — should show pure black screen with glowing pill nav centered top
2. Workflow begins with human figure + Q1 question visible
3. Click YES on Q1 → VIP card appears, Analyze Information node pulses, NO branch fades, canvas pans slightly right
4. Click NO instead → YES branch disappears, NO continues cleanly
5. Continue clicking through → each new node fades in, connections draw themselves
6. Q3 YES: write-up card appears
7. Q3 NO: escalation node and card appear
8. Hover states: nodes glow, dotted paths animate on hover even before clicking
9. No layout breaks, no dashboard panels, no filled empty space
