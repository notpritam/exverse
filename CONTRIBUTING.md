# Contributing to Exverse

Thanks for wanting to add to the place people come to learn something. The highest-value contribution
is **a new course** — but fixes, design polish, and accessibility improvements are all welcome.

## Add a course

A course is a folder of typed data. No CMS, no database.

### 1. Create the folder

```
content/courses/<your-slug>/
  course.data.json     # { meta, parts, sections }
  index.ts             # types + exports the course
```

`course.data.json` shape:

```jsonc
{
  "meta":  { "title": "…", "author": "…", "when": "…", "duration": "…" },
  "parts": [ { "n": "I", "id": "p1", "title": "…", "blurb": "…" } ],
  "sections": [ { "id": "…", "part": 1, "time": "00:00", "title": "…", "tagline": "…",
                 "mental": "…", "blocks": [ … ], "takeaways": [ … ],
                 "exercises": [ … ], "quiz": [ … ] } ]
}
```

`index.ts`:

```ts
import type { Course } from "@/lib/types";
import data from "./course.data.json";

const course: Course = {
  slug: "your-slug",
  cover: "/img/your-slug/cover.jpg",
  source: { label: "Original source", note: "Credit + link." },
  meta: (data as any).meta,
  parts: (data as any).parts,
  sections: (data as any).sections,
};
export default course;
```

### 2. Add images

Put them in `public/img/<your-slug>/` and reference by filename in `fig` blocks
(`{ "t": "fig", "src": "shot.jpg", "url": "example.com", "cap": "…" }`).

### 3. Register it

Add your course to the array in `lib/content.ts`:

```ts
import yourCourse from "@/content/courses/your-slug";
const COURSES: Course[] = [howIUseLLMs, yourCourse];
```

### 4. Verify + PR

```bash
npm run build   # every lesson prerenders; type errors surface here
```

Open a PR. Keep commits focused.

## Block types

`lead` · `p` · `callout` (`k`: `model|tool|verify|think|tip`) · `quote` (`ts`) · `fig` (`src,url,cap,alt`) ·
`steps` (`title,items`) · `list` (`items`) · `code` (`file,h`) · `table` (`head,rows`).
Quiz items: `{ type:"flash", q, a }` or `{ type:"mcq", q, opts, correct, why }`.

## The quality bar

- **Lead with the mental model.** Every node's single load-bearing idea, up front.
- **Credit the source** and link back. Exverse is a study companion, never a replacement.
- **Real examples over summaries.** The examples are the lesson.
- **End with a Q&A that can be gotten wrong.** Recognition isn't learning.

## Code style

TypeScript, Tailwind, and the existing design tokens (don't hard-code colors — use the
CSS variables / Tailwind token classes so themes keep working). Keep components small and focused.
