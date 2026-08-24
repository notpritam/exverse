import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCourses, getCourse, getSection, getAdjacent, chapterNumber, partOf } from "@/lib/content";
import Blocks from "@/components/lesson/Blocks";
import Extras from "@/components/lesson/Extras";
import Quiz from "@/components/lesson/Quiz";

type Params = { course: string; node: string };

// Prerender every lesson to static HTML → instant loads + SEO.
export function generateStaticParams(): Params[] {
  return getAllCourses().flatMap((c) => c.sections.map((s) => ({ course: c.slug, node: s.id })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { course, node } = await params;
  const s = getSection(course, node);
  const c = getCourse(course);
  if (!s || !c) return {};
  const title = `${s.title} — ${c.meta.title}`;
  return {
    title,
    description: s.tagline,
    openGraph: { title, description: s.tagline, url: `/learn/${course}/${node}` },
    twitter: { title, description: s.tagline },
  };
}

export default async function Lesson({ params }: { params: Promise<Params> }) {
  const { course: slug, node } = await params;
  const course = getCourse(slug);
  const s = getSection(slug, node);
  if (!course || !s) notFound();

  const { prev, next } = getAdjacent(slug, node);
  const chap = String(chapterNumber(course, node)).padStart(2, "0");
  const part = partOf(course, s.part);

  return (
    <article className="mx-auto max-w-3xl px-6 py-10 lg:px-12 lg:py-14">
      <div className="lz-head">
        <span className="chap">Ch {chap}</span>
        <span className="stamp">◷ {s.time}</span>
        <span className="font-display text-sm text-muted">{part?.title}</span>
      </div>

      <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-ink">{s.title}</h1>
      <p className="mt-2 font-display text-xl text-muted">{s.tagline}</p>

      <div className="lz-mental">
        <span className="badge">mental&nbsp;model</span>
        <p dangerouslySetInnerHTML={{ __html: s.mental }} />
      </div>

      <Blocks blocks={s.blocks} courseSlug={slug} />
      <Extras takeaways={s.takeaways} exercises={s.exercises} />
      {s.quiz && s.quiz.length > 0 && (
        <Quiz courseSlug={slug} nodeId={s.id} total={course.sections.length} quiz={s.quiz} />
      )}

      <nav className="mt-11 flex justify-between gap-4 border-t border-line pt-6">
        {prev ? (
          <Link
            href={`/learn/${slug}/${prev.id}`}
            className="flex-1 rounded-xl border border-line bg-panel px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-ink"
          >
            <span className="block font-mono text-[11px] uppercase tracking-wider text-faint">← Previous</span>
            <span className="mt-0.5 block font-display text-[15px] font-semibold text-ink">{prev.title}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/learn/${slug}/${next.id}`}
            className="flex-1 rounded-xl border border-line bg-panel px-4 py-3.5 text-right transition-all hover:-translate-y-0.5 hover:border-ink"
          >
            <span className="block font-mono text-[11px] uppercase tracking-wider text-faint">Next →</span>
            <span className="mt-0.5 block font-display text-[15px] font-semibold text-ink">{next.title}</span>
          </Link>
        ) : (
          <Link
            href={`/learn/${slug}`}
            className="flex-1 rounded-xl border border-line bg-panel px-4 py-3.5 text-right transition-all hover:-translate-y-0.5 hover:border-ink"
          >
            <span className="block font-mono text-[11px] uppercase tracking-wider text-faint">Done →</span>
            <span className="mt-0.5 block font-display text-[15px] font-semibold text-ink">Back to the roadmap ✓</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
