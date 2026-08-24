import { getCourse } from "@/lib/content";
import CurriculumSidebar from "@/components/course/CurriculumSidebar";

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const c = getCourse(course);
  const nodes = c ? c.sections.map((s) => ({ id: s.id, title: s.title, part: s.part })) : [];
  const parts = c ? c.parts.map((p) => ({ n: p.n, title: p.title })) : [];

  return (
    <div className="flex">
      {c && <CurriculumSidebar slug={course} title={c.meta.title} parts={parts} nodes={nodes} />}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
