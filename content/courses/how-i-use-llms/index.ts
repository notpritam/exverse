import type { Course, Block, Section } from "@/lib/types";
import data from "./course.data.json";

const meta = (data as any).meta;
const parts = (data as any).parts;
const sections: Section[] = (data as any).sections;

// Interactive animated explainers, injected at chosen positions in a lesson.
const ANIMS: Record<string, { at: number; block: Block }[]> = {
  "zip-file": [
    { at: 4, block: { t: "anim", name: "training", cap: "Pre-training compresses the internet; post-training adds the persona." } },
  ],
  "context-window": [
    { at: 1, block: { t: "anim", name: "token-stream", cap: "You and the model take turns filling the context window." } },
  ],
  "thinking-models": [
    { at: 2, block: { t: "anim", name: "thinking", cap: "Fast answers are instant but can be wrong; thinking reasons it out." } },
  ],
  "models-and-tiers": [
    { at: 2, block: { t: "anim", name: "pricing", cap: "The tier you pay for decides which brain answers you." } },
  ],
  "internet-search": [
    { at: 1, block: { t: "anim", name: "tool-use", cap: "The model searches, loads the pages into context, then answers." } },
  ],
  "python-interpreter": [
    { at: 2, block: { t: "anim", name: "python", cap: "It writes a program, runs it, and reads back the exact result." } },
  ],
  "audio-input": [
    { at: 1, block: { t: "anim", name: "modalities", cap: "Beyond text: audio, images, and video — native or tacked-on." } },
  ],
};

for (const s of sections) {
  const inserts = ANIMS[s.id];
  if (inserts) {
    for (const { at, block } of [...inserts].sort((a, b) => b.at - a.at)) {
      s.blocks.splice(Math.min(at, s.blocks.length), 0, block);
    }
  }
}

const course: Course = {
  slug: "how-i-use-llms",
  cover: "/img/how-i-use-llms/diagram-final.jpg",
  source: {
    label: "“How I use LLMs” — Andrej Karpathy (Feb 2025)",
    note: "A study companion built from the ~2h06m talk. All demos, screenshots, and quotes belong to their creator.",
  },
  meta,
  parts,
  sections,
};

export default course;
