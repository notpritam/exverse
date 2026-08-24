import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Why Exverse exists: an open-source place to learn something, one roadmap at a time.",
};

export default function About() {
  return (
    <main className="mx-auto max-w-measure px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">About</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">
        A place to <span className="text-zip">learn something</span>.
      </h1>

      <div className="lesson mt-8 font-serif text-[1.08rem] text-ink">
        <p className="lead">
          The best explanations of hard things are often locked inside two-hour videos. Great to watch
          once — terrible to <em>learn</em> from. You can't search them, can't jump around them, and the
          one idea you were supposed to keep is spread across a hundred minutes of demos.
        </p>
        <p>
          Exverse turns that material into something you can actually absorb. Each course is an{" "}
          <strong>interactive roadmap</strong> you click through. Every node is a tight lesson — the
          load-bearing idea first, the real screens, the exact words — capped with a{" "}
          <strong>Q&amp;A that makes it stick</strong>. Your progress lights up the map as you go.
        </p>
        <p>
          It's <strong>open source</strong>, on purpose. The best courses come from the people who just
          learned the thing and remember exactly where they got stuck. Courses here are just files in a
          repo — so anyone can add one.
        </p>
        <div className="lz-callout tip">
          <div className="h">
            <span className="tag">the standard</span> Study companion, not a replacement
          </div>
          <p>
            Courses credit their source and link back to it. Exverse helps you internalize great
            material — it never pretends to be the original.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/#courses" className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-display text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5">
          Browse courses
        </Link>
        <Link href="/contribute" className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-5 py-3 font-display text-sm font-semibold text-ink transition-colors hover:border-ink">
          Add a course
        </Link>
      </div>
    </main>
  );
}
