"use client";

import { useCallback, useEffect, useState } from "react";
import type { NodeStatus } from "./types";

/**
 * Local-first progress. Phase 1 will add a server-backed implementation and a
 * local→account merge; consumers only use the hook below, so pages don't change.
 */
const KEY = "exverse-progress-v1";
type Store = Record<string, Record<string, NodeStatus>>; // course -> node -> status

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
function write(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    // notify same-tab listeners (storage event only fires cross-tab)
    window.dispatchEvent(new CustomEvent("exverse:progress"));
  } catch {}
}

async function pushStore(): Promise<Store | null> {
  try {
    const r = await fetch("/api/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ progress: read() }),
    });
    if (!r.ok) return null;
    return (await r.json()).progress as Store;
  } catch {
    return null;
  }
}

/** After login: push local progress up, pull the merged result back down. */
export async function syncProgress() {
  const merged = await pushStore();
  if (merged) {
    try {
      localStorage.setItem(KEY, JSON.stringify(merged));
    } catch {}
    window.dispatchEvent(new CustomEvent("exverse:progress"));
  }
}

export function useProgress(courseSlug: string, total: number) {
  const [map, setMap] = useState<Record<string, NodeStatus>>({});
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setMap(read()[courseSlug] || {});
  }, [courseSlug]);

  useEffect(() => {
    refresh();
    setReady(true);
    const onChange = () => refresh();
    window.addEventListener("exverse:progress", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("exverse:progress", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const setStatus = useCallback(
    (nodeId: string, status: NodeStatus) => {
      const all = read();
      const course = { ...(all[courseSlug] || {}) };
      // never downgrade done -> doing on a revisit
      if (course[nodeId] === "done" && status === "doing") return;
      course[nodeId] = status;
      write({ ...all, [courseSlug]: course });
      setMap(course);
      // write-through to the account when logged in
      if (typeof window !== "undefined" && (window as { __exvAuthed?: boolean }).__exvAuthed) {
        void pushStore();
      }
    },
    [courseSlug]
  );

  const statusOf = useCallback((nodeId: string): NodeStatus => map[nodeId] || "todo", [map]);

  const doneCount = Object.values(map).filter((s) => s === "done").length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return { ready, statusOf, setStatus, doneCount, pct, map };
}

/** Read the id to resume at (first not-done, in the given order). */
export function resumeId(courseSlug: string, order: string[]): string | null {
  if (typeof window === "undefined") return null;
  const map = read()[courseSlug] || {};
  const next = order.find((id) => map[id] !== "done");
  return next ?? order[0] ?? null;
}
