import type { Course, Section } from "./types";
import howIUseLLMs from "@/content/courses/how-i-use-llms";

// Course registry. Add a course by dropping a folder in content/courses/ and
// registering it here (see CONTRIBUTING).
const COURSES: Course[] = [howIUseLLMs];
const BY_SLUG = new Map(COURSES.map((c) => [c.slug, c]));

export function getAllCourses(): Course[] {
  return COURSES;
}

export function getCourse(slug: string): Course | undefined {
  return BY_SLUG.get(slug);
}

export function getSection(slug: string, nodeId: string): Section | undefined {
  return getCourse(slug)?.sections.find((s) => s.id === nodeId);
}

/** Prev/next in course order — powers instant, prefetched lesson navigation. */
export function getAdjacent(slug: string, nodeId: string): { prev?: Section; next?: Section } {
  const secs = getCourse(slug)?.sections ?? [];
  const i = secs.findIndex((s) => s.id === nodeId);
  if (i === -1) return {};
  return { prev: secs[i - 1], next: secs[i + 1] };
}

export function partOf(course: Course, partNo: number) {
  return course.parts[partNo - 1];
}

/** Group sections by their part, preserving order — used by the roadmap. */
export function sectionsByPart(course: Course): { part: Course["parts"][number]; sections: Section[] }[] {
  return course.parts.map((part, idx) => ({
    part,
    sections: course.sections.filter((s) => s.part === idx + 1),
  }));
}

/** Absolute index (1-based) of a section across the whole course. */
export function chapterNumber(course: Course, nodeId: string): number {
  return course.sections.findIndex((s) => s.id === nodeId) + 1;
}

export const imgSrc = (courseSlug: string, file: string) =>
  file.startsWith("/") ? file : `/img/${courseSlug}/${file}`;
