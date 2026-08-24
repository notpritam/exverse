"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { syncProgress } from "@/lib/progress";

export default function AccountMenu() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((j) => {
        setUser(j.user);
        setLoaded(true);
        if (j.user) {
          (window as { __exvAuthed?: boolean }).__exvAuthed = true;
          void syncProgress();
        }
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) return <span className="h-8 w-16" aria-hidden />;

  if (!user)
    return (
      <Link
        href="/login"
        className="inline-flex items-center rounded-[9px] bg-ink px-3.5 py-1.5 font-display text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
      >
        Sign in
      </Link>
    );

  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5 font-mono text-xs text-ink sm:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-think" /> @{user.username}
      </span>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-[9px] border border-line bg-panel px-3 py-1.5 font-display text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
