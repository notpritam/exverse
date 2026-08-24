"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction, type ActionState } from "@/app/actions/auth";
import RecoveryReveal from "@/components/auth/RecoveryReveal";

const field =
  "w-full rounded-xl border border-line bg-panel px-4 py-3 font-display text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-ink";

export default function SignupPage() {
  const [state, action, pending] = useActionState<ActionState, FormData>(signupAction, null);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-line bg-panel p-7 shadow-card">
        {state?.ok && state.recoveryKey ? (
          <RecoveryReveal keyStr={state.recoveryKey} title="Account created — save your recovery key" />
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Create your account</h1>
            <p className="mt-2 font-serif text-[15px] text-muted">
              Username + password. You&apos;ll get a one-time recovery key instead of email resets.
            </p>
            <form action={action} className="mt-6 space-y-3">
              <input name="username" className={field} placeholder="username" autoComplete="username" autoCapitalize="none" required minLength={3} maxLength={24} />
              <input name="password" type="password" className={field} placeholder="password (8+ characters)" autoComplete="new-password" required minLength={8} />
              {state?.error && <p className="text-sm text-verify">{state.error}</p>}
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-ink px-4 py-3 font-display text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {pending ? "Creating…" : "Create account"}
              </button>
            </form>
            <p className="mt-5 text-center font-display text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-zip">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
