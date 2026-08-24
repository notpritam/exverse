# Exverse — Requirements (living list)

> The running list of everything asked for, so nothing gets dropped. Updated as we go.
> Status legend: ✅ locked · 🟡 proposed (my recommendation, pending your ok) · ❓ needs clarification

_Last updated: 2026-08-24_

## Vision
✅ **Exverse** — an open-source place people come to *learn something*. A multi-course learning
platform where each course is an **interactive roadmap** you click through, with real lessons,
end-of-step Q&A, and progress that follows you. Polished and shareable enough to trend.

## Locked decisions
1. ✅ Multi-course **platform**; first course = **How I Use LLMs — Andrej Karpathy** (content already authored).
2. ✅ **Roadmap is home** (roadmap.sh concept): a visual node map; click a node → its lesson page. Nodes color by progress.
3. ✅ Each node/lesson = **passage** (reading) + real screens + **end-of-step Q&A / quiz**.
4. ✅ **Per-user progress**, cross-device via accounts; anonymous/device-local fallback that merges on login.
5. ✅ **Custom auth, no Supabase.** Username + password (hashed). At signup the user gets a **crypto-style recovery key** (shown once, saved by them). Forgot password → recover with that key. No email dependency.
6. ✅ **Next.js (App Router, RSC)**, **heavily SSR-optimized** → instant navigation (prefetch + server components + cached static content).
7. ✅ **Course flow follows what Karpathy advises** — the roadmap order = his mental-model progression (zip file → thinking → tool use → modalities → make-it-yours). His "cartoon diagram" *becomes* the roadmap.
8. ✅ **Design system**: create + document one, built in **Tailwind**, with **theme support** (light/dark, room for more).
9. ✅ **Open source** — license (MIT), README, `CONTRIBUTING` with an "add a course" guide, `.env.example`.
10. ✅ **Shareable / built to trend** — SEO metadata, dynamic per-course/lesson **OG images**, "share your progress." In depth.
11. ✅ **Engaging, in-depth, interactive diagrams** — the roadmap + animated lesson diagrams; raise interaction, not just reading.
12. ✅ Deploy (Vercel-friendly).
13. ✅ Maintain **this living requirements list**.
14. ✅ **GitHub repo under `notpritam`**. (Caveat: this environment is authed to GitHub as `notpritamm`, which can't push to `notpritam/*` — you'll grant access or push. Local commits use the `notpritam` identity regardless.)
15. ✅ **Commit at each step** (incremental commits as the build progresses).
16. ✅ **No mention of "Claude" anywhere** — not in commit messages, not as git author/committer. Author every commit as **notpritam** only. (Overrides the default co-author trailer.)
17. ✅ **Course-focused positioning** — should read and behave like a real course/learning platform (course landing → curriculum/roadmap → lesson player → progress), not a generic dashboard. Draw on course-site UX patterns.

## "Multiple levels of agents" — resolved (all four)
- ✅ **AI tutor agents** (tiered): per-node hint bot · full course tutor chat · "quiz-me / explain-this". Grounded in course content. (Needs an LLM API key; a later phase.)
- ✅ **User roles / permissions**: learner → author → moderator → admin (RBAC).
- ✅ **Difficulty levels / tracks**: beginner / intermediate / advanced layering on the roadmap.
- ✅ **Agentic course-building pipeline**: author → fact-checker → quiz-writer → editor agents that turn a source (e.g. a video/transcript) into a course — i.e. productize how the Karpathy course was made by hand.

## Delivery phases (build in order; each ships + commits independently)
- **Phase 0 — Foundation ✅ SHIPPED.** Next.js 15 App Router + TS + Tailwind + design system + light/dark themes. Content-as-code; ported the LLMs course (25 lessons, 44 frames). **Roadmap-is-home** interactive map + lesson pages (passage + screens + end-of-step Q&A). Local-first progress (todo/doing/done, DB-ready). All pages static-prerendered for instant nav. Dynamic OG/SEO. Open-source scaffold (MIT, README, CONTRIBUTING). Deploy-ready (Vercel). Verified end-to-end in-browser.
- **Phase 1 — Accounts & sync** (NEXT). Custom auth (username/password + crypto recovery key) · **MongoDB** (user-provided; replaces the earlier Prisma/Postgres plan) · logged-in state (header shows user, sign in/out) · per-user progress, merge local→account · **roles** foundation. Needs `MONGODB_URI` + `AUTH_SESSION_SECRET`.

### UI redesign (done, live)
- ✅ **Udemy-style course player**: persistent curriculum sidebar + full-width lessons (no more narrow column).
- ✅ **Remotion interactive explainers** — 7 in varied styles (token cells, search flow, compress particles, reasoning-chain comparison, bar chart, terminal typewriter, radial hub); custom player controls (play/pause, restart, ±1s, scrub). Full-width landing with a live explainer.
- **Phase 2 — AI tutor agents.** In-lesson grounded tutor + quiz-me/explain-this (LLM API + retrieval).
- **Phase 3 — Difficulty tracks & richer roadmap.** Beginner/intermediate/advanced gating; multiple tracks per course.
- **Phase 4 — Agentic course-building.** author→fact-check→quiz→edit pipeline to add new courses at scale.

## Proposed stack (pending spec approval)
- 🟡 Next.js App Router + TypeScript + Tailwind. Content-as-code (`content/courses/<slug>/`) so contributors add courses via PRs.
- 🟡 Rendering: lessons/roadmap statically pre-rendered (RSC) for instant loads; interactive islands (roadmap canvas, quiz, tutor, auth) are client components; `<Link>` prefetch.
- 🟡 Auth: custom — Argon2id password hash; recovery key = high-entropy phrase, hash stored, verifies the reset. Signed httpOnly cookie sessions.
- 🟡 Data: Prisma ORM → SQLite (local dev) / Postgres (prod, any provider **except** Supabase — e.g. Neon/Railway). Tables: `User`, `Progress`. (Open to a fully local-first variant — will note in spec.)
- 🟡 Design system: CSS-variable tokens themed via Tailwind; port existing language (Space Grotesk / Newsreader / JetBrains Mono; amber=model, teal=thinking, violet=tools, rust=verify).
- 🟡 Deploy: Vercel + chosen Postgres. Dynamic OG via Next `ImageResponse`.

## Out of scope for v1 (revisit later)
- Payments / paid courses. Multiple languages/i18n. Native mobile app. User-generated courses in-app (contributions via PR for now).
