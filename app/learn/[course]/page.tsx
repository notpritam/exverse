import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCourses, getCourse } from "@/lib/content";
import Roadmap from "@/components/roadmap/Roadmap";

type Params = { course: string };

export function generateStaticParams(): Params[] {
  return getAllCourses().map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { course } = await params;
  const c = getCourse(course);
  if (!c) return {};
  const description = `${c.meta.title} — an interactive roadmap after ${c.meta.author}. ${c.sections.length} lessons with end-of-step Q&A and progress tracking.`;
  return {
    title: c.meta.title,
    description,
    openGraph: { title: c.meta.title, description, url: `/learn/${course}` },
  };
}

export default async function CoursePage({ params }: { params: Promise<Params> }) {
  const { course: slug } = await params;
  const c = getCourse(slug);
  if (!c) notFound();

  // Pass only light data to the client roadmap — lesson blocks stay server-side.
  const nodes = c.sections.map((s) => ({ id: s.id, title: s.title, tagline: s.tagline, part: s.part }));
  const parts = c.parts.map((p) => ({ n: p.n, title: p.title }));

  return (
    <Roadmap
      slug={slug}
      title={c.meta.title}
      author={c.meta.author}
      duration={c.meta.duration}
      parts={parts}
      nodes={nodes}
    />
  );
}
