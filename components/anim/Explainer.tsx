"use client";

import { Player, type PlayerRef, type CallbackListener } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import TokenStream from "./compositions/TokenStream";
import ToolUse from "./compositions/ToolUse";
import Training from "./compositions/Training";
import ThinkingChain from "./compositions/ThinkingChain";
import PricingBars from "./compositions/PricingBars";
import PythonRun from "./compositions/PythonRun";
import ModalitiesHub from "./compositions/ModalitiesHub";

type Entry = { Comp: React.FC; duration: number; fps: number; w: number; h: number; title: string };

const REG: Record<string, Entry> = {
  "token-stream": { Comp: TokenStream, duration: 210, fps: 30, w: 900, h: 460, title: "The context window fills up" },
  "tool-use": { Comp: ToolUse, duration: 205, fps: 30, w: 900, h: 460, title: "Search loads the web into context" },
  training: { Comp: Training, duration: 165, fps: 30, w: 900, h: 460, title: "How the zip file is built" },
  thinking: { Comp: ThinkingChain, duration: 220, fps: 30, w: 900, h: 460, title: "Fast answer vs. a thinking model" },
  pricing: { Comp: PricingBars, duration: 180, fps: 30, w: 900, h: 460, title: "Bigger model, more capability" },
  python: { Comp: PythonRun, duration: 220, fps: 30, w: 900, h: 460, title: "When it writes and runs code" },
  modalities: { Comp: ModalitiesHub, duration: 220, fps: 30, w: 900, h: 460, title: "One model, every modality" },
};

const fmt = (frame: number, fps: number) => {
  const s = frame / fps;
  return `${Math.floor(s)}.${Math.floor((s % 1) * 10)}s`;
};

export default function Explainer({ name, caption }: { name: string; caption?: string }) {
  const e = REG[name];
  const ref = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const onFrame: CallbackListener<"frameupdate"> = (ev) => setFrame(ev.detail.frame);
    const onPlay: CallbackListener<"play"> = () => setPlaying(true);
    const onPause: CallbackListener<"pause"> = () => setPlaying(false);
    p.addEventListener("frameupdate", onFrame);
    p.addEventListener("play", onPlay);
    p.addEventListener("pause", onPause);
    return () => {
      p.removeEventListener("frameupdate", onFrame);
      p.removeEventListener("play", onPlay);
      p.removeEventListener("pause", onPause);
    };
  }, []);

  if (!e) return null;

  const seek = (f: number) => {
    const p = ref.current;
    if (!p) return;
    p.pause();
    p.seekTo(Math.max(0, Math.min(e.duration - 1, Math.round(f))));
  };
  const btn = "grid h-8 w-8 place-items-center rounded-md text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink";

  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-card">
        <Player
          ref={ref}
          component={e.Comp}
          durationInFrames={e.duration}
          compositionWidth={e.w}
          compositionHeight={e.h}
          fps={e.fps}
          loop
          autoPlay
          clickToPlay
          controls={false}
          acknowledgeRemotionLicense
          style={{ width: "100%", aspectRatio: `${e.w} / ${e.h}`, cursor: "pointer" }}
        />
        {/* custom interactive control bar */}
        <div className="flex items-center gap-1 border-t border-line bg-paper-2/60 px-2 py-1.5">
          <button className={btn} onClick={() => seek(0)} aria-label="Restart">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
          </button>
          <button className={btn} onClick={() => seek(frame - e.fps)} aria-label="Back one second">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 19 2 12l9-7zM22 19l-9-7 9-7z" /></svg>
          </button>
          <button className={btn} onClick={() => ref.current?.toggle()} aria-label={playing ? "Pause" : "Play"}>
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>
            )}
          </button>
          <button className={btn} onClick={() => seek(frame + e.fps)} aria-label="Forward one second">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 5l9 7-9 7zM2 5l9 7-9 7z" /></svg>
          </button>
          <input
            type="range"
            min={0}
            max={e.duration - 1}
            value={frame}
            onChange={(ev) => seek(Number(ev.target.value))}
            className="exv-scrub mx-2 h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line"
            aria-label="Scrub"
          />
          <span className="w-14 text-right font-mono text-[11px] text-muted">
            {fmt(frame, e.fps)}/{fmt(e.duration, e.fps)}
          </span>
        </div>
      </div>
      <figcaption className="mt-2.5 flex items-center gap-2 font-display text-[13px] text-muted">
        <span className="rounded-full bg-tool-wash px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-tool">interactive</span>
        {caption || e.title} — play, scrub, or step through it
      </figcaption>
    </figure>
  );
}
