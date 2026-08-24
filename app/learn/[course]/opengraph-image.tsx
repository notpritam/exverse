import { ImageResponse } from "next/og";
import { getAllCourses, getCourse } from "@/lib/content";

export const alt = "An Exverse course";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ course: c.slug }));
}

export default async function OG({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  const c = getCourse(course);
  const title = c?.meta.title ?? "Course";
  const author = c?.meta.author ?? "";
  const lessons = c?.sections.length ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbfaf4",
          color: "#17160f",
          padding: 70,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "#17160f", color: "#fbfaf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25, fontWeight: 800 }}>
              E
            </div>
            <div style={{ fontSize: 27, fontWeight: 700 }}>Exverse</div>
          </div>
          <div style={{ fontSize: 24, color: "#6d6a5a", letterSpacing: 2, textTransform: "uppercase" }}>
            interactive roadmap
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 90, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>{title}</div>
          <div style={{ fontSize: 34, color: "#6d6a5a", marginTop: 18 }}>
            {`after ${author} · ${lessons} lessons, each with a Q&A`}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ height: 10, width: 260, borderRadius: 99, background: "linear-gradient(90deg,#c67b22,#6338ce,#1e7a66)" }} />
          <div style={{ fontSize: 24, color: "#97927e" }}>click any node to open the lesson</div>
        </div>
      </div>
    ),
    size
  );
}
