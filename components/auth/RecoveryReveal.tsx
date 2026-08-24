"use client";

import Link from "next/link";
import { useState } from "react";

export default function RecoveryReveal({ keyStr, title }: { keyStr: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="w-full">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">{title || "Save your recovery key"}</h1>
      <p className="mt-3 font-serif text-[15px] text-ink-soft">
        This key is the <b>only</b> way back into your account if you forget your password — there&apos;s no email
        reset. Store it somewhere safe. We hash it and can never show it again.
      </p>

      <div className="mt-5 rounded-xl border border-zip bg-zip-wash px-5 py-4 text-center font-mono text-lg font-semibold tracking-wide text-ink">
        {keyStr}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            navigator.clipboard?.writeText(keyStr);
            setCopied(true);
          }}
          className="flex-1 rounded-xl border border-line bg-panel px-4 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          {copied ? "Copied ✓" : "Copy key"}
        </button>
      </div>

      <Link
        href="/learn/how-i-use-llms"
        className="mt-3 block rounded-xl bg-ink px-4 py-3 text-center font-display text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
      >
        I&apos;ve saved it — continue
      </Link>
    </div>
  );
}
