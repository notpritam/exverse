"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/actions/auth";

const field =
  "w-full rounded-xl border border-line bg-panel px-4 py-3 font-display text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-ink";

export default function LoginPage() {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, null);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-line bg-panel p-7 shadow-card">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Welcome back</h1>
        <p className="mt-2 font-serif text-[15px] text-muted">Sign in to sync your progress across devices.</p>
        <form action={action} className="mt-6 space-y-3">
          <input name="username" className={field} placeholder="username" autoComplete="username" autoCapitalize="none" required />
          <input name="password" type="password" className={field} placeholder="password" autoComplete="current-password" required />
          {state?.error && <p className="text-sm text-verify">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-ink px-4 py-3 font-display text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="mt-5 flex items-center justify-between font-display text-sm">
          <Link href="/recover" className="text-muted transition-colors hover:text-ink">
            Forgot password?
          </Link>
          <Link href="/signup" className="font-semibold text-zip">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
