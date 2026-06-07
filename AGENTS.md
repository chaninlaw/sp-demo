## Workflow Orchestration

### 1. Plan Mode Default

- Calibrate planning depth to task risk, blast radius, and reversibility — skip the plan for trivial/reversible work; invest deeply when changes are hard to undo or affect shared systems
- Plan to minimize wasted tokens: surface assumptions, unknowns, and verification checkpoints up front so you don't loop on ambiguity mid-execution
- Specs should be only as detailed as the ambiguity demands — over-specifying burns tokens, under-specifying burns rework
- Stay adaptive: when new evidence contradicts the plan, STOP, update the plan, then continue — never push through a stale plan
- Re-use plan mode for verification stages too, not just building
- Prefer revising an existing plan over re-planning from scratch when the goal is unchanged

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`

## UI Design System

This project uses **shadcn/ui** (Base UI primitives + Tailwind v4) as the design system. All components live in `components/ui/`. Always reach for these before writing plain HTML.

### Design tokens — always use CSS variables, never hard-code colours

- **Backgrounds**: `bg-background`, `bg-card`, `bg-muted`, `bg-accent`
- **Text**: `text-foreground`, `text-muted-foreground`, `text-primary`, `text-destructive`
- **Borders**: `border-border`, `border-input`
- **Brand / accent**: `text-primary`, `bg-primary`, `text-primary-foreground`
- **Danger**: `text-destructive`, `bg-destructive/10`
- **Spacing & radius**: use Tailwind scale (`p-4`, `rounded-xl`, etc.) — never inline `style`

### Patterns learned from this codebase

- Cards with a flush top image: `<Card className="pt-0">` — the image `<div>` goes before `<CardHeader>` as the first child
- Equal-height cards in a grid: `<Link className="h-full"><Card className="h-full">` + `<CardContent className="mt-auto">` to pin bottom content
- Category/filter chips: `<Button variant="default"|"secondary" size="sm" className="rounded-full">`
- Out-of-stock overlay: `absolute inset-0 bg-background/75 backdrop-blur-[2px]` inside the image wrapper
- Teal top-accent border on product cards: `border-t-2 border-t-primary`
- Use Conditional Rendering to reset state on unmount, and use `<Activity>` in React to preserve state and side effects while hidden.

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Communicate for minimal reader effort**: prefer short bullets and tables over long paragraphs
