"use client";

import { Player } from "@remotion/player";
import TokenStream from "./compositions/TokenStream";
import ToolUse from "./compositions/ToolUse";
import Training from "./compositions/Training";

type Entry = { Comp: React.FC; duration: number; fps: number; w: number; h: number; title: string };

const REG: Record<string, Entry> = {
  "token-stream": { Comp: TokenStream, duration: 210, fps: 30, w: 900, h: 460, title: "The context window fills up" },
  "tool-use": { Comp: ToolUse, duration: 205, fps: 30, w: 900, h: 460, title: "Search loads the web into context" },
  training: { Comp: Training, duration: 165, fps: 30, w: 900, h: 460, title: "How the zip file is built" },
};

export default function Explainer({ name, caption }: { name: string; caption?: string }) {
  const e = REG[name];
  if (!e) return null;
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-card">
        <Player
          component={e.Comp}
          durationInFrames={e.duration}
          compositionWidth={e.w}
          compositionHeight={e.h}
          fps={e.fps}
          loop
          autoPlay
          controls
          acknowledgeRemotionLicense
          style={{ width: "100%", aspectRatio: `${e.w} / ${e.h}` }}
        />
      </div>
      <figcaption className="mt-2.5 flex items-center gap-2 font-display text-[13px] text-muted">
        <span className="rounded-full bg-tool-wash px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-tool">
          animated
        </span>
        {caption || e.title} — scrub or replay
      </figcaption>
    </figure>
  );
}
