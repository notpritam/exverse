"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/progress";

export type LiteNode = { id: string; title: string; part: number };
export type LitePart = { n: string; title: string };

function StatusDot({ s }: { s: "done" | "doing" | "todo" }) {
  if (s === "done")
    return (
      <span className="grid h-4 w-4 place-items-center rounded-full bg-think text-[9px] text-paper">✓</span>
    );
  if (s === "doing") return <span className="h-4 w-4 rounded-full border-2 border-zip bg-zip/20" />;
  return <span className="h-4 w-4 rounded-full border border-line" />;
}

export default function CurriculumSidebar({
  slug,
  title,
  parts,
  nodes,
}: {
  slug: string;
  title: string;
  parts: LitePart[];
  nodes: LiteNode[];
}) {
  const total = nodes.length;
  const { ready, statusOf, pct, doneCount } = useProgress(slug, total);
  const pathname = usePathname();
  const current = pathname.split("/").pop();
  const [open, setOpen] = useState(false); // mobile drawer
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center" });
  }, [current]);

  const grouped = parts.map((p, i) => ({ part: p, items: nodes.filter((n) => n.part === i + 1) }));
  let idx = 0;

  const body = (
    <>
      <div className="border-b border-line px-4 pb-4 pt-4">
        <Link href={`/learn/${slug}`} className="font-mono text-[11px] text-muted transition-colors hover:text-ink">
          ← roadmap
        </Link>
        <p className="mt-1.5 font-display text-[15px] font-bold leading-tight text-ink">{title}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-2">
            <div className="h-full rounded-full bg-gradient-to-r from-zip to-think transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-mono text-[11px] text-muted">{doneCount}/{total}</span>
        </div>
      </div>

      <nav className="px-2 py-3">
        {grouped.map(({ part, items }) => (
          <div key={part.n} className="mb-2">
            <div className="flex items-baseline gap-2 px-2 py-1.5">
              <span className="font-mono text-[10px] text-zip">{part.n}</span>
              <span className="font-display text-[12px] font-semibold text-ink">{part.title}</span>
            </div>
            {items.map((n) => {
              idx += 1;
              const s = ready ? statusOf(n.id) : "todo";
              const isActive = n.id === current;
              return (
                <Link
                  key={n.id}
                  href={`/learn/${slug}/${n.id}`}
                  ref={isActive ? activeRef : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${
                    isActive ? "bg-paper-2" : "hover:bg-paper-2/60"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    <StatusDot s={s} />
                  </span>
                  <span className="flex-1">
                    <span className="font-mono text-[10px] text-faint">{String(idx).padStart(2, "0")}</span>
                    <span className={`block font-display text-[13px] leading-snug ${isActive ? "font-semibold text-ink" : "text-ink-soft"}`}>
                      {n.title}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="sticky top-14 z-30 flex w-full items-center gap-2 border-b border-line bg-paper/90 px-5 py-2.5 font-display text-sm font-semibold text-ink backdrop-blur lg:hidden"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        Curriculum · {doneCount}/{total}
      </button>

      {/* desktop sticky rail */}
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[320px] shrink-0 overflow-y-auto border-r border-line bg-paper lg:block">
        {body}
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[300px] overflow-y-auto border-r border-line bg-paper shadow-float">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg border border-line text-muted">✕</button>
            {body}
          </div>
        </div>
      )}
    </>
  );
}
