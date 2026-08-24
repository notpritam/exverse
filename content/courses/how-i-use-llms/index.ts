import type { Course } from "@/lib/types";
import data from "./course.data.json";

// Authored data (25 sections in Karpathy's advised order) + course-level metadata.
const course: Course = {
  slug: "how-i-use-llms",
  cover: "/img/how-i-use-llms/diagram-final.jpg",
  source: {
    label: "“How I use LLMs” — Andrej Karpathy (Feb 2025)",
    note: "A study companion built from the ~2h06m talk. All demos, screenshots, and quotes belong to their creator.",
  },
  meta: (data as any).meta,
  parts: (data as any).parts,
  sections: (data as any).sections,
};

export default course;
