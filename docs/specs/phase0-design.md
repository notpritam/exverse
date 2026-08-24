# Exverse — Phase 0 (Foundation) — Design Spec

_Date: 2026-08-24 · Status: awaiting approval_

## Goal
Ship the foundation of **Exverse**, an open-source, course-focused learning platform where each
course is an **interactive roadmap** (roadmap.sh concept) you click through, with real lesson
pages (passage + screens + end-of-step Q&A) and progress that's tracked. First course:
**How I Use LLMs — Andrej Karpathy**, structured in his advised flow. Next.js, SSR/SSG-optimized
for instant navigation. A distinctive Tailwind design system with light/dark themes. Deployable
to Vercel; MIT open source. This phase deliberately excludes accounts, AI agents, tracks, and the
course-builder pipeline (Phases 1–4) — but is architected so they slot in cleanly.

Success = a stranger lands on it, the roadmap makes them want to click, lessons feel premium,
progress persists on their device, it loads instantly, and it looks good enough to post.

## Stack
- **Next.js (App Router, RSC) + TypeScript + Tailwind CSS.**
- **Rendering:** content pages (`/learn/[course]`, `/learn/[course]/[node]`) are statically
  generated via `generateStaticParams` (content is code) → instant loads + SEO. Interactivity
  (roadmap canvas, quiz, theme toggle, progress) lives in small client components. `<Link>`
  prefetch makes node→node navigation instant. This is the "heavy SSR" ask: server-render/prebuild
  everything static, ship minimal JS, hydrate only islands.
- **No backend in Phase 0.** Progress is local-first (`localStorage`) behind a `ProgressStore`
  interface so Phase 1 swaps in the DB/account version with zero page changes.

## Routes
| Route | Rendering | Purpose |
|---|---|---|
| `/` | static | Exverse landing — course-focused: hero, the featured course, "how it works", why it exists |
| `/learn/[course]` | static (SSG) | The **course roadmap** — the home of a course; the interactive map |
| `/learn/[course]/[node]` | static (SSG) | A **lesson**: passage + real screens + end-of-step Q&A + prev/next |
| `/about`, `/contribute` | static | What Exverse is; how to add a course (PR guide) |
| `opengraph-image` (per course/lesson) | dynamic | Shareable OG cards via `ImageResponse` |

## Content model (content-as-code)
```
content/
  courses/
    how-i-use-llms/
      course.ts        # meta: slug, title, author, blurb, cover, tags, parts[]
      roadmap.ts       # nodes[] {id, title, part, difficulty, deps[]} → auto-laid-out graph
      nodes/           # one module per node (ports existing section data)
        zip-file.ts     # {passage blocks[], screens[], quiz[]}
        ...
      assets/          # → public/ at build (the 44 screenshots)
```
Contributors add a course by dropping a new folder here (documented in CONTRIBUTING). A tiny
loader validates shape at build. Existing authored content (25 sections, quotes, quizzes,
screenshots) ports directly into `nodes/`.

## The roadmap engine (the signature)
- Input: `roadmap.ts` (nodes grouped by the 6 parts, in Karpathy's order) → an **auto-layout**
  into a vertical/branching map (parts as stages; the "cartoon diagram" grows into the map).
- Rendered as an accessible SVG/HTML hybrid: nodes are clickable pills connected by paths,
  **color-coded by progress** (not-started · in-progress · done) and by pedagogy accent
  (amber/teal/violet/rust). Hover = preview; click = go to lesson (prefetched). A course
  **progress bar** and %; keyboard navigable; pans on mobile; respects reduced-motion.
- This is the "engaging, in-depth, interactive diagram" — the thing people screenshot.

## Lesson page
Per node, in Karpathy's flow: eyebrow (part · ◷ timestamp) → title → **mental-model card** →
passage (prose, callouts color-coded, his quotes with timestamps, screenshots in browser chrome)
→ **takeaways** → "try it yourself" → **end-of-step Q&A** (flashcards + MCQ, interactive) →
prev/next. Marks the node in-progress on view, done on quiz-complete/scroll-through.

## Design system (Tailwind + themes)
- **Tokens** as CSS variables (color, type scale, spacing, radius, shadow, motion); Tailwind
  `theme.extend` maps to them so utilities and tokens stay in sync.
- **Themes** via `data-theme` on `<html>`: `light` (warm paper) and `dark` (midnight), switchable,
  persisted, SSR-safe (no flash). Architected for more themes later.
- **Type:** Space Grotesk (display) · Newsreader (serif reading body) · JetBrains Mono (code/tokens).
- **Accents (pedagogy):** amber = model/knowledge · teal = thinking · violet = tools · rust = verify.
- **Components:** Button, Card, Callout, Badge, Chrome (screenshot frame), ProgressBar, RoadmapNode,
  Quiz (flash + mcq), ThemeToggle, CommandPalette (search). Documented in `DESIGN.md` + a `/design`
  page that renders the system (living style guide).

## Progress (local-first, DB-ready)
`ProgressStore` interface: `getCourse(slug)`, `setNode(slug,nodeId,status)`, `recordQuiz(...)`.
Phase 0 impl = `localStorage`; the roadmap + progress bar + "resume" read from it. Phase 1 adds a
server impl and a local→account merge — pages/components don't change.

## Shareability / trend
Per-course & per-lesson `generateMetadata` (title, description, canonical) + dynamic
`opengraph-image` rendering the roadmap/diagram + title (+ progress on share). "Share" affordances.
Fast Core Web Vitals from the static + island approach.

## Open source & repo
- New project at `exverse/` (its own git repo; later pushed under **notpritam**).
- MIT `LICENSE`, `README` (what/why/run/deploy), `CONTRIBUTING` (add-a-course), `.env.example` (empty for now).
- **Commits:** incremental, one per meaningful step; authored as **notpritam**; **no mention of Claude**
  anywhere (author, committer, or message).
- Deploy target: Vercel (`next build`, static content). Caveat: this env's GitHub is `notpritamm`
  (can't push to `notpritam/*`) — handled at push time by you or by granting access.

## File map (target)
```
exverse/
  app/                     (layout, page, /learn/[course], /learn/[course]/[node], /about, /contribute, /design)
  components/              (roadmap/, lesson/, ui/, ThemeToggle, CommandPalette)
  content/courses/how-i-use-llms/ (course.ts, roadmap.ts, nodes/*)
  lib/                     (content loader, progress store, roadmap layout, seo)
  public/img/              (the 44 screenshots)
  styles/                  (tokens.css, globals.css)
  tailwind.config.ts, next.config.ts, tsconfig.json, package.json
  DESIGN.md, README.md, CONTRIBUTING.md, LICENSE, .env.example
```

## Non-goals (Phase 0)
Accounts/auth, server DB, AI tutor, difficulty gating, the agentic course-builder, payments, i18n.
All are later phases and the architecture leaves clean seams for each.

## Build order (with a commit at each)
1. Scaffold Next.js + Tailwind + design tokens/themes + base layout. 
2. Design system components + `/design` page.
3. Content model + port the LLMs course data + screenshots.
4. Roadmap engine + `/learn/[course]`.
5. Lesson page + quizzes + prev/next.
6. Local-first progress wired into roadmap + resume.
7. Landing page + about/contribute.
8. SEO + OG images + share.
9. Open-source files + README/CONTRIBUTING + deploy config.
```
