"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useProgress, resumeId } from "@/lib/progress";

export type LiteNode = { id: string; title: string; tagline: string; part: number };
export type LitePart = { n: string; title: string };

// part index (1-based) → pedagogy accent var
function accent(part: number): string {
  return ["--zip", "--zip", "--tool", "--think", "--ink", "--zip"][part - 1] || "--zip";
}

export default function Roadmap({
  slug,
  title,
  author,
  duration,
  parts,
  nodes,
}: {
  slug: string;
  title: string;
  author: string;
  duration?: string;
  parts: LitePart[];
  nodes: LiteNode[];
}) {
  const total = nodes.length;
  const { ready, statusOf, pct, doneCount } = useProgress(slug, total);
  const order = useMemo(() => nodes.map((n) => n.id), [nodes]);
  const resume = ready ? resumeId(slug, order) : order[0];
  const started = doneCount > 0;

  // group nodes by part, preserving order
  const grouped = useMemo(
    () => parts.map((p, i) => ({ part: p, items: nodes.filter((n) => n.part === i + 1) })),
    [parts, nodes]
  );

  let idx = 0;
  return (
    <div>
      {/* course header */}
      <header className="mx-auto max-w-3xl px-6 pt-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
          Interactive roadmap{duration ? ` · ${duration}` : ""}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mt-3 font-display text-lg text-muted">
          after <span className="text-ink">{author}</span> — click any node to open the lesson
        </p>

        <div className="mx-auto mt-7 flex max-w-md items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full border border-line bg-paper-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-zip to-think transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted">
            {doneCount}/{total} · {pct}%
          </span>
        </div>

        <div className="mt-6">
          <Link
            href={`/learn/${slug}/${resume}`}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 font-display text-[15px] font-semibold text-paper shadow-card transition-transform hover:-translate-y-0.5"
          >
            {started ? "Resume where you left off" : "Start the course"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 font-mono text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--zip)" }} /> model</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--think)" }} /> thinking</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--tool)" }} /> tools</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--verify)" }} /> verify</span>
        </div>
      </header>

      {/* the map */}
      <div className="rm mt-8 px-5">
        {grouped.map(({ part, items }) => (
          <div key={part.n}>
            <div className="rm-part">
              <span className="chip">
                <span className="pn">{part.n}</span> {part.title}
              </span>
            </div>
            {items.map((n) => {
              idx += 1;
              const side = idx % 2 === 1 ? "l" : "r";
              const st = ready ? statusOf(n.id) : "todo";
              const stLabel = st === "done" ? "done ✓" : st === "doing" ? "in progress" : "";
              return (
                <div key={n.id} className={`rm-row ${side} ${st}`}>
                  <span className="rm-pin" />
                  <div className="rm-node">
                    <Link href={`/learn/${slug}/${n.id}`} className="rm-card" prefetch>
                      <div className="top">
                        <span className="acc" style={{ background: `var(${accent(n.part)})` }} />
                        <span className="num">{String(idx).padStart(2, "0")}</span>
                        <span className="st">{stLabel}</span>
                      </div>
                      <h3>{n.title}</h3>
                      <p>{n.tagline}</p>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
