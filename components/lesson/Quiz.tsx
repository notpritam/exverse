"use client";

import { useEffect, useMemo, useState } from "react";
import type { Quiz } from "@/lib/types";
import { useProgress } from "@/lib/progress";

export default function QuizBlock({
  courseSlug,
  nodeId,
  total,
  quiz,
}: {
  courseSlug: string;
  nodeId: string;
  total: number;
  quiz: Quiz[];
}) {
  const { ready, statusOf, setStatus } = useProgress(courseSlug, total);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [chosen, setChosen] = useState<Record<number, number>>({});
  const [done, setDone] = useState<Set<number>>(new Set());

  // mark "doing" on first arrival
  useEffect(() => {
    if (ready && statusOf(nodeId) === "todo") setStatus(nodeId, "doing");
  }, [ready, nodeId, statusOf, setStatus]);

  // when every item has been engaged, mark the section done
  useEffect(() => {
    if (quiz.length > 0 && done.size >= quiz.length && statusOf(nodeId) !== "done") {
      setStatus(nodeId, "done");
    }
  }, [done, quiz.length, nodeId, statusOf, setStatus]);

  const complete = (i: number) => setDone((s) => (s.has(i) ? s : new Set(s).add(i)));

  const status = statusOf(nodeId);
  const label = useMemo(
    () => (status === "done" ? "Section complete ✓" : "Mark section complete"),
    [status]
  );

  return (
    <div className="lz-quiz">
      <div className="h">
        <span className="i">?</span> Check yourself
      </div>

      {quiz.map((q, i) =>
        q.type === "flash" ? (
          <div key={i} className={`lz-card ${open[i] ? "open" : ""}`}>
            <div
              className="q"
              onClick={() => {
                setOpen((o) => ({ ...o, [i]: !o[i] }));
              }}
            >
              <span className="n">{i + 1}</span>
              <span>{q.q}</span>
            </div>
            <div className="a">
              <button
                className="lz-reveal"
                onClick={() => {
                  setOpen((o) => ({ ...o, [i]: true }));
                  complete(i);
                }}
              >
                Reveal answer ▾
              </button>
              <p>{q.a}</p>
            </div>
          </div>
        ) : (
          <div key={i} className="lz-card">
            <div className="q">
              <span className="n">{i + 1}</span>
              <span>{q.q}</span>
            </div>
            <div className="lz-opts">
              {q.opts.map((opt, k) => {
                const answered = chosen[i] !== undefined;
                const cls = answered
                  ? k === q.correct
                    ? "correct"
                    : k === chosen[i]
                    ? "wrong"
                    : ""
                  : "";
                return (
                  <button
                    key={k}
                    className={`lz-opt ${cls}`}
                    disabled={answered}
                    onClick={() => {
                      setChosen((c) => ({ ...c, [i]: k }));
                      complete(i);
                    }}
                  >
                    <span className="k">{"ABCD"[k]}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {chosen[i] !== undefined && q.why && <p className="lz-why">{q.why}</p>}
          </div>
        )
      )}

      <button
        onClick={() => setStatus(nodeId, "done")}
        className={`mt-4 inline-flex items-center gap-2 rounded-[10px] px-4 py-2 font-display text-sm font-semibold transition-colors ${
          status === "done"
            ? "border border-think bg-think-wash text-think"
            : "bg-ink text-paper hover:opacity-90"
        }`}
      >
        {label}
      </button>
    </div>
  );
}
