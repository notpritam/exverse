import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribute a course",
  description: "Courses are just files in the repo. Drop a folder, register it, open a PR.",
};

export default function Contribute() {
  return (
    <main className="mx-auto max-w-measure px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Contribute</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">Add the next course.</h1>
      <p className="mt-4 font-serif text-[1.08rem] text-ink-soft">
        A course is a folder of typed data — no CMS, no database. If you can write TypeScript objects, you
        can add a course.
      </p>

      <div className="lesson mt-8 font-serif text-[1.06rem] text-ink">
        <div className="lz-steps">
          <div className="h">Three steps</div>
          <ol>
            <li>
              Create <code>content/courses/&lt;your-slug&gt;/</code> with a <code>course.data.json</code>{" "}
              (meta, parts, sections) and an <code>index.ts</code> that types &amp; exports it.
            </li>
            <li>
              Drop your images in <code>public/img/&lt;your-slug&gt;/</code> and reference them from{" "}
              <code>fig</code> blocks.
            </li>
            <li>
              Register the course in <code>lib/content.ts</code>, run <code>npm run build</code>, open a PR.
            </li>
          </ol>
        </div>

        <p>Each section follows one shape — the renderer switches on the block <code>t</code>:</p>
        <div className="lz-code">
          <div className="bar">
            <span className="d" /> <span className="d" /> <span className="d" />
            <span className="f">section</span>
          </div>
          <pre>
            <code>{`{
  id: "your-first-node",
  part: 1,
  time: "00:00",
  title: "The one idea",
  tagline: "A one-line hook.",
  mental: "The load-bearing idea, in a sentence.",
  blocks: [
    { t: "lead", h: "Open strong." },
    { t: "callout", k: "verify", title: "Watch out", h: "..." },
    { t: "fig", src: "shot.jpg", url: "example.com", cap: "..." },
  ],
  takeaways: ["...", "..."],
  exercises: [{ t: "Try it", p: "...", hint: "..." }],
  quiz: [
    { type: "flash", q: "...", a: "..." },
    { type: "mcq", q: "...", opts: ["A","B"], correct: 1, why: "..." },
  ],
}`}</code>
          </pre>
        </div>

        <div className="lz-callout model">
          <div className="h">
            <span className="tag">the bar</span> What makes a good Exverse course
          </div>
          <p>
            Every node leads with its mental model. Credit the source and link back. Prefer real
            examples over summaries. End every step with a Q&amp;A that could be gotten wrong.
          </p>
        </div>
      </div>

      <a
        href="https://github.com/notpritam/exverse"
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-display text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
      >
        Open the repo on GitHub →
      </a>
    </main>
  );
}
