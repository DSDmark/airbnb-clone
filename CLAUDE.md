@AGENTS.md

# Claude Code workflow for this repo

## Subagents (`.claude/agents/`)

Delegate review work so the main thread stays on implementation:

| Agent | Use it when |
| --- | --- |
| `fidelity-reviewer` | After visual changes: captures the clone, diffs it against `reference/screens`, reports offsets with likely CSS causes. |
| `motion-inspector` | After touching an overlay, hover state or transition: records frame-by-frame timings and compares them with the spec in `docs/fidelity-notes.md`. |
| `a11y-auditor` | After adding/altering interactive UI: keyboard walk-through, focus order/restoration, ARIA, axe. |
| `code-reviewer` | Before finishing a task: structure, conventions from AGENTS.md, dead code, duplicated styles, hook correctness. |

Run independent reviewers in parallel (one message, several Agent calls).

## Skills (`.claude/skills/`)

- `measure-page` — census a page's boxes/fonts/colours/shadows and record motion.
- `visual-diff` — capture + pixel diff loop, and how to read blend images.
- `design-system` — tokens, button variants, overlay primitives; read before adding UI.
- `reference-capture` — how reference material is obtained without bypassing its bot protection.

## Working loop for a section

1. Read the reference capture (`reference/screens`, `reference/reference-content.json`).
2. Measure (`measure-page`), write the component with tokens, render it.
3. `npm run visual:capture && npm run visual:diff`; iterate until the blend is crisp.
4. `npm run check`; then run `code-reviewer` and `a11y-auditor`.

Hooks in `.claude/settings.json` lint every edited TS/TSX file, so fix what
they report before moving on.
