"use server";

import { redirect } from "next/navigation";
import { signup, login, recover, clearSession } from "@/lib/auth";

export type ActionState = { ok?: boolean; error?: string; recoveryKey?: string } | null;

const g = (fd: FormData, k: string) => String(fd.get(k) || "").trim();

export async function signupAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const r = await signup(g(fd, "username"), String(fd.get("password") || ""));
  return r.ok ? { ok: true, recoveryKey: r.recoveryKey } : { ok: false, error: r.error };
}

export async function loginAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const r = await login(g(fd, "username"), String(fd.get("password") || ""));
  if (r.ok) redirect("/learn/how-i-use-llms");
  return { ok: false, error: r.error };
}

export async function recoverAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const r = await recover(g(fd, "username"), g(fd, "key"), String(fd.get("password") || ""));
  return r.ok ? { ok: true, recoveryKey: r.recoveryKey } : { ok: false, error: r.error };
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}
