"use client";

import Link from "next/link";
import { useActionState } from "react";
import { recoverAction, type ActionState } from "@/app/actions/auth";
import RecoveryReveal from "@/components/auth/RecoveryReveal";

const field =
  "w-full rounded-xl border border-line bg-panel px-4 py-3 font-display text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-ink";

export default function RecoverPage() {
  const [state, action, pending] = useActionState<ActionState, FormData>(recoverAction, null);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-line bg-panel p-7 shadow-card">
        {state?.ok && state.recoveryKey ? (
          <RecoveryReveal keyStr={state.recoveryKey} title="Password reset — here's your new recovery key" />
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Recover your account</h1>
            <p className="mt-2 font-serif text-[15px] text-muted">
              Enter your username, your recovery key, and a new password.
            </p>
            <form action={action} className="mt-6 space-y-3">
              <input name="username" className={field} placeholder="username" autoComplete="username" autoCapitalize="none" required />
              <input name="key" className={`${field} font-mono`} placeholder="EXV-XXXX-XXXX-XXXX-XXXX" required />
              <input name="password" type="password" className={field} placeholder="new password (8+ characters)" autoComplete="new-password" required minLength={8} />
              {state?.error && <p className="text-sm text-verify">{state.error}</p>}
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-ink px-4 py-3 font-display text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {pending ? "Recovering…" : "Reset password"}
              </button>
            </form>
            <p className="mt-5 text-center font-display text-sm text-muted">
              Remembered it? <Link href="/login" className="font-semibold text-zip">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
