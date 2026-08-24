<div align="center">

# Exverse

**An open-source place to learn something.**
Every course is an interactive roadmap you click through — real lessons, end-of-step Q&A, and progress that follows you.

</div>

---

Not videos you forget. Understanding you keep. Exverse takes dense source material (a two-hour talk, a paper, a doc) and turns it into something you can actually absorb: a visual **roadmap** where each node is a tight lesson — the load-bearing idea first, the real screens, the exact words — capped with a **Q&A that makes it stick**. Your progress lights up the map.

**First course:** _How I Use LLMs_ — after Andrej Karpathy — 25 lessons across 6 parts, in his advised flow.

## Why it's fast

Content is code, so every page is **prerendered to static HTML** and served from the edge. React Server Components ship zero JS for the prose; only the interactive bits (roadmap, quiz, theme) hydrate. `<Link>` prefetches the next lesson before you click. Navigation is instant.

## Stack

- **Next.js 15** (App Router, RSC) · **TypeScript** · **Tailwind CSS**
- CSS-variable **design tokens** with light + dark **themes** (SSR-safe, no flash)
- **Content-as-code** — courses are typed data in `content/courses/`
- **Local-first progress** today; accounts + sync land in Phase 1

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
# or a production build:
npm run build && npm start
```

## Deploy

Zero-config on **Vercel** (`next build`). Any Node host works; static content is served from the edge.

## Add a course

Courses are just files — no CMS, no database:

1. Create `content/courses/<slug>/` with `course.data.json` (meta, parts, sections) and an `index.ts`.
2. Put images in `public/img/<slug>/` and reference them from `fig` blocks.
3. Register the course in `lib/content.ts`, run `npm run build`, open a PR.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and the in-app [`/contribute`](http://localhost:3000/contribute) page.

## Roadmap (the project's own)

- **Phase 0 — Foundation** ✅ — platform, design system, roadmap, lessons, local progress _(you are here)_
- **Phase 1 — Accounts** — username/password with a crypto-style recovery key, per-user progress, roles
- **Phase 2 — AI tutor agents** — grounded in-lesson tutor, quiz-me / explain-this
- **Phase 3 — Difficulty tracks** — beginner / intermediate / advanced gating
- **Phase 4 — Agentic course-builder** — author → fact-check → quiz → edit pipeline

## Layout

```
app/            routes: /, /learn/[course], /learn/[course]/[node], /about, /contribute
components/     roadmap/, lesson/, SiteHeader, ThemeToggle
content/courses/<slug>/  course data (+ course.data.json)
lib/            content loader, progress store, types
public/img/<slug>/       course images
app/globals.css + tailwind.config.ts   the design system
```

## License

[MIT](./LICENSE). Course content is a study companion; each course credits and links to its source.
