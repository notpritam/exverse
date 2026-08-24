// Content model. Blocks mirror the authored data; the renderer switches on `t`.

export type Accent = "model" | "tool" | "verify" | "think" | "tip";

export type Block =
  | { t: "lead"; h: string }
  | { t: "p"; h: string }
  | { t: "callout"; k: Accent; title?: string; h: string }
  | { t: "quote"; ts?: string; h: string }
  | { t: "fig"; src: string; cap?: string; alt?: string; url?: string }
  | { t: "steps"; title?: string; items: string[] }
  | { t: "list"; items: string[] }
  | { t: "code"; file?: string; h: string }
  | { t: "table"; head: string[]; rows: string[][] };

export type Flashcard = { type: "flash"; q: string; a: string };
export type MCQ = { type: "mcq"; q: string; opts: string[]; correct: number; why?: string };
export type Quiz = Flashcard | MCQ;

export interface Exercise {
  t: string;
  p: string;
  hint?: string;
}

export interface Section {
  id: string;
  part: number; // 1-based part index
  time: string; // moment in the source video
  title: string;
  tagline: string;
  mental: string;
  blocks: Block[];
  takeaways?: string[];
  exercises?: Exercise[];
  quiz?: Quiz[];
}

export interface Part {
  n: string; // roman numeral label
  id: string;
  title: string;
  blurb: string;
}

export interface CourseMeta {
  title: string;
  author: string;
  when?: string;
  duration?: string;
  tagline?: string;
}

export interface Course {
  slug: string;
  cover: string; // path under /public
  source?: { label: string; note?: string };
  meta: CourseMeta;
  parts: Part[];
  sections: Section[];
}

export type NodeStatus = "todo" | "doing" | "done";
