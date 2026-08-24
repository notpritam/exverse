import Link from "next/link";
import Image from "next/image";
import { getAllCourses } from "@/lib/content";
import Explainer from "@/components/anim/Explainer";

export default function Home() {
  const courses = getAllCourses();
  const featured = courses[0];

  return (
    <main>
      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-12 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-wider text-muted">
            <span className="h-2 w-2 rounded-full bg-think" /> open source · learn by doing
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.03] tracking-tight text-ink sm:text-6xl xl:text-7xl">
            The place to <span className="text-zip">learn something</span>.
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-ink-soft">
            Every course is an interactive roadmap you click through — real lessons, animated
            explainers, end-of-step Q&amp;A, and progress that follows you. Not videos you forget.
            Understanding you keep.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={`/learn/${featured.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 font-display text-[15px] font-semibold text-paper shadow-card transition-transform hover:-translate-y-0.5"
            >
              Explore the course
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-6 py-3.5 font-display text-[15px] font-semibold text-ink transition-colors hover:border-ink"
            >
              How it works
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted">
            <span><b className="text-ink">25</b> lessons</span>
            <span><b className="text-ink">7</b> animated explainers</span>
            <span><b className="text-ink">49</b> self-check questions</span>
            <span><b className="text-ink">1</b> roadmap</span>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-panel p-3 shadow-float">
          <Explainer name="tool-use" caption="A live explainer from the course — this is what a lesson feels like." />
        </div>
      </section>

      {/* featured course */}
      <section id="courses" className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Courses</h2>
          <span className="font-mono text-xs text-muted">{courses.length} live · more coming</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {courses.map((c) => (
            <Link
              key={c.slug}
              href={`/learn/${c.slug}`}
              className="group overflow-hidden rounded-2xl border border-line bg-panel shadow-card transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-paper-2">
                <Image
                  src={c.cover}
                  alt={c.meta.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 520px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
                  <span className="rounded-full bg-zip-wash px-2 py-0.5 text-zip">{c.sections.length} lessons</span>
                  {c.meta.duration && <span>· {c.meta.duration} of source</span>}
                </div>
                <h3 className="mt-2.5 font-display text-xl font-bold tracking-tight text-ink">{c.meta.title}</h3>
                <p className="mt-1 font-serif text-[15px] text-muted">
                  after {c.meta.author} — the whole talk as a roadmap you can absorb.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-zip">
                  Open the roadmap
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}

          {/* "your course here" invite */}
          <div className="flex flex-col items-start justify-center gap-3 rounded-2xl border border-dashed border-line p-6">
            <span className="font-mono text-[11px] uppercase tracking-wider text-faint">Open source</span>
            <p className="font-display text-lg font-semibold text-ink">Add the next course.</p>
            <p className="font-serif text-[15px] text-muted">
              Courses are just files in the repo. Drop a folder, open a PR.
            </p>
            <Link href="/contribute" className="mt-1 font-display text-sm font-semibold text-zip">
              How to contribute →
            </Link>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="text-center font-display text-2xl font-bold tracking-tight text-ink">How Exverse works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { k: "01", t: "Follow the roadmap", d: "Each course is a visual map. See the whole shape, click any node, watch it light up as you go.", c: "--zip" },
            { k: "02", t: "Learn the lesson", d: "A tight passage, the real screens, the exact quotes — the load-bearing idea first, always.", c: "--tool" },
            { k: "03", t: "Prove it stuck", d: "End-of-step Q&A — flashcards and questions you can get wrong. Progress that follows you.", c: "--think" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-line bg-panel p-6 shadow-card">
              <span className="font-mono text-sm" style={{ color: `var(${s.c})` }}>
                {s.k}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-ink">{s.t}</h3>
              <p className="mt-2 font-serif text-[15px] leading-relaxed text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="font-mono text-xs text-muted">
          Exverse — an open-source place to learn something. Built in the open.
        </p>
      </footer>
    </main>
  );
}
