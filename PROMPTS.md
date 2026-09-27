# Prompt log

The sequence of prompts used to build this submission with Claude Code
(Claude Opus, agentic mode in VS Code), in order. User prompts are verbatim;
the assignment text pasted with the first prompt is reproduced in the fold.
Prompts the agent wrote for its own subagents are listed after the user
prompts, also verbatim, with what came back.

---

## 1 · User — kickoff

> make project in nextjs ok skip backend:
>
> Playpower Labs Assignment: Airbnb-Clone App

Attachment: `Playpower Labs Assignment_ Airbnb-Clone App.pdf` (the brief, with
reference screenshots of the listing page, photo tour and lightbox).

<details>
<summary>Pasted assignment text (verbatim)</summary>

```text
Take-Home Task: Airbnb-Clone App

We'd like you to build a pixel-perfect clone of a real Airbnb listing page. The goal is to assess how precisely you can reproduce a polished, production-quality UI, exactly as it looks and exactly as it behaves.

Match the reference exactly, visually and behaviorally. It is the single source of truth, and your clone must match it across:
Visual design: identical layout, spacing, typography, colours, icons, and assets.
Animations and motion: matching hover and scroll animations, and transitions.
Interaction and accessibility: keyboard navigation, focus management, and accessibility.

Reference (the exact page to reproduce): https://airbnb-clone-umber-two.vercel.app

We are looking for AI-native developers. Internally, we use tools like Claude Code, Codex, and Cursor heavily in our development workflow, and we encourage you to use AI-assisted development for this task as well.

We do not recommend doing this task without AI usage. Please use the latest premium AI models that can be accessed for free or at a substantial discount through legitimate sources such as the GitHub Student Developer Pack. With the right approach, it can be completed in around 3-4 hours using the latest AI models.

AI agents and workflows can be used to help with the cloning implementation, any direct lift and shift of the codebase from the url could result in lower score or disqualification.

We have a plagiarism detection mechanism in place. Please ensure that your work is original and does not contain any plagiarized content.

What to Build
Recreate the Airbnb listing page and its two overlay views exactly as they look and behave at the reference. There are three views:
Screen / Expected implementation
Listing Page — The full property page. Match the layout, spacing, typography, colours, and interactions exactly.
Photo Tour — Full-screen photo gallery opened from Show all photos or any hero image.
Lightbox — Single-photo viewer opened from any gallery photo with prev/next arrows, keyboard ←/→ navigation. Match the interactions and animations exactly.

Note: Implement Desktop only; mobile version is not required
Tech Stack
You are free to choose the tech stack you are most comfortable with. Suggested options:
Frontend: React, Next.js, or Angular
Backend: Node.js or Java
Backend is optional. You may also choose to store data in frontend/browser storage if that keeps your implementation simple and focused. You may use Vercel or any other free hosting platform for deployment.
Architecture Diagram
Submit a high-level architecture diagram for a production-scale vacation-rental marketplace (think Airbnb) alongside your app. The diagram should illustrate your scaling strategy for frontend, backend, storage, search, and deployment. Tools like lucid.app or excalidraw are recommended.
What We Will Look At
Modern AI workflow usage (coding agents, sub-agents, skills, prompts)
How closely the clone matches the reference, visual fidelity and behavioural parity, including animations, transitions, and accessibility
Production architecture thinking
AI subagent configs for code quality and project structure
Please keep the scope focused and do include your sub-agent/skill config files in your submission. A clean, complete implementation is better than an over-engineered incomplete one.
Submission (Important: Please do not push the code to a public GitHub repository.)
Please submit the task as per the instructions shared with you over email. The submission must include the following deliverables:
A zipped file containing the code and architecture diagram (image/pdf file).
The sequence of prompts used for AI-assisted development, it might be asked during submission.
```

</details>

**What the agent did with it**

1. Tried to load the reference: it sits behind Vercel BotID and refuses
   automated browsers. Treated that as a boundary — no evasion — and designed a
   human-in-the-loop capture instead (`reference/`).
2. Identified the reference as Airbnb's listing template, found a live listing
   by the same host and building ("Mirashya A102") that automation may load,
   and used it as the measuring target: computed-style census, frame-by-frame
   motion recordings, screenshots of every overlay state.
3. Scaffolded Next.js 16 + TypeScript + CSS Modules, generated the icon
   registry and typed calibration data from the captured assets, then built
   the page, photo tour, lightbox, dialogs, booking popovers and map.
4. Iterated on pixel diffs (blend images per scroll offset) until each
   1440×900 view was within ~1–2 px; wrote Playwright E2E + axe tests.

## 2 · User — deliverables (sent mid-build)

> also created a Prompt logs (.md or .txt)
>
> Upload your AI Prompts history you used to complete the assignment. We use this to understand more about your prompting style.
>
> also provide me with
>
> AI config files (AGENTS.md, CLAUDE.md, .claude/).
> An architecture diagram (image or PDF) inside the zip.

**What the agent did with it:** wrote this log; added `AGENTS.md`, `CLAUDE.md`
and `.claude/` (4 subagents, 4 skills, permissions + lint hook); generated the
architecture diagram from `docs/architecture/build-diagram.py` and rendered it
to PNG + PDF; added `npm run package` to build the zip.

---

## Agent → subagent prompts

The review subagents defined in `.claude/agents/` were run in parallel on the
finished build (via general-purpose agents instructed to follow those
definitions, since agent files are loaded at session start).

### code-reviewer

```text
You are acting as the `code-reviewer` subagent defined in .claude/agents/code-reviewer.md. Read that file first and follow its checklist and report format exactly. Also read AGENTS.md for the project conventions.

Project: a Next.js 16 (App Router, React 19, TypeScript, CSS Modules) clone of an Airbnb listing page. There is no git repo, so review the whole `src/` tree (all .tsx/.ts/.css files) plus `scripts/`, `tests/e2e/`, `playwright.config.ts`, `next.config.ts`. `src/data/listing.ts` and `src/components/icons/registry.ts` are large generated data files — skim them for structure only.

Constraints:
- READ-ONLY. Do not edit, create or delete any file in the project. You may run `npm run typecheck` and `npm run lint` and grep/read freely.
- Do not start or stop the dev server; one is already running on port 3100.
- Focus on real defects and convention violations: React hook correctness (stale closures, effect deps, cleanup), focus/escape/scroll-lock logic in src/hooks/*, ui/Modal.tsx, gallery/* (URL-backed state in GalleryProvider, PhotoTour, Lightbox), popovers in booking/*, accessibility semantics you notice in passing, CSS-module hygiene (unused classes, duplicated styles, magic numbers without comments), dead code, and anything that would break under `next build`.
- Be concrete: `file:line — issue — suggested fix`, grouped must-fix / should-fix / nit, and finish with the one-line verdict. Keep the whole report under ~60 lines.
```

### a11y-auditor

```text
You are acting as the `a11y-auditor` subagent defined in .claude/agents/a11y-auditor.md. Read that file first and follow its procedure and report format.

A dev server is ALREADY running at http://localhost:3100 — do not start another one and do not kill it. Use the cached Chromium via PW_CHROMIUM_PATH / executablePath. @axe-core/playwright is installed.

Rules:
- READ-ONLY with respect to the project; scratch scripts go in the session scratchpad.
- Cover: axe on the page, photo tour, lightbox, the dialogs opened by "Show more about this place", "Show all 54 amenities", "Show all 47 reviews", "Share", the date picker, the guests popover and the header menu.
- Scripted keyboard pass: tab order from the top, focus moves into each overlay, Tab never escapes, Escape closes only the top-most overlay, focus returns to the opener (lightbox → last viewed photo), arrows in lightbox and calendar, browser Back closes tour/lightbox.
- Report issues by severity with WCAG refs, reproduction steps and the component file to change. Colours that mirror the reference: flag them but mark as "reference parity". Keep the report under ~70 lines.
```

<!-- review outcomes appended below -->
