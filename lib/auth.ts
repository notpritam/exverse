import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";

const COOKIE = "exv_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export type Role = "learner" | "author" | "moderator" | "admin";
export type User = { id: string; username: string; role: Role };

/* ---------- hashing (scrypt) ---------- */
function hashSecret(secret: string): string {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(secret.normalize("NFKC"), salt, 32);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}
function verifySecret(secret: string, stored: string): boolean {
  const [saltHex, keyHex] = stored.split(":");
  if (!saltHex || !keyHex) return false;
  const key = crypto.scryptSync(secret.normalize("NFKC"), Buffer.from(saltHex, "hex"), 32);
  const a = Buffer.from(keyHex, "hex");
  return a.length === key.length && crypto.timingSafeEqual(a, key);
}

/* ---------- recovery key (crypto-style, shown once) ---------- */
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32(buf: Buffer): string {
  let bits = 0, value = 0, out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}
export function generateRecoveryKey(): string {
  const g = base32(crypto.randomBytes(15)).slice(0, 20).match(/.{1,4}/g)!;
  return `EXV-${g.join("-")}`;
}
const normKey = (k: string) => k.toUpperCase().replace(/[^A-Z2-7]/g, "");

/* ---------- session cookie (HMAC-signed) ---------- */
function secret(): string {
  const s = process.env.AUTH_SESSION_SECRET;
  if (!s) throw new Error("AUTH_SESSION_SECRET is not set");
  return s;
}
function sign(uid: string): string {
  const payload = Buffer.from(JSON.stringify({ uid, iat: Date.now() })).toString("base64url");
  const mac = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}
function unsign(token: string): string | null {
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(mac), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const { uid, iat } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (Date.now() - iat > MAX_AGE * 1000) return null;
    return uid as string;
  } catch {
    return null;
  }
}

async function setSession(uid: string) {
  (await cookies()).set(COOKIE, sign(uid), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}
export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

/* ---------- user operations ---------- */
export type AuthResult = { ok: true; recoveryKey?: string } | { ok: false; error: string };

export function validateUsername(u: string): string | null {
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(u)) return "Username must be 3–24 letters, numbers, or underscores.";
  return null;
}
export function validatePassword(p: string): string | null {
  if (p.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export async function signup(username: string, password: string): Promise<AuthResult> {
  const uErr = validateUsername(username);
  if (uErr) return { ok: false, error: uErr };
  const pErr = validatePassword(password);
  if (pErr) return { ok: false, error: pErr };

  const db = await getDb();
  const uname = username.toLowerCase();
  const exists = await db.collection("users").findOne({ username: uname });
  if (exists) return { ok: false, error: "That username is taken." };

  const recoveryKey = generateRecoveryKey();
  const now = new Date();
  const res = await db.collection("users").insertOne({
    username: uname,
    display: username,
    passwordHash: hashSecret(password),
    recoveryHash: hashSecret(normKey(recoveryKey)),
    role: "learner" as Role,
    createdAt: now,
  });
  await setSession(res.insertedId.toString());
  return { ok: true, recoveryKey };
}

export async function login(username: string, password: string): Promise<AuthResult> {
  const db = await getDb();
  const user = await db.collection("users").findOne({ username: username.toLowerCase() });
  if (!user || !verifySecret(password, user.passwordHash)) {
    return { ok: false, error: "Wrong username or password." };
  }
  await setSession(user._id.toString());
  return { ok: true };
}

export async function recover(username: string, recoveryKey: string, newPassword: string): Promise<AuthResult> {
  const pErr = validatePassword(newPassword);
  if (pErr) return { ok: false, error: pErr };
  const db = await getDb();
  const user = await db.collection("users").findOne({ username: username.toLowerCase() });
  if (!user || !verifySecret(normKey(recoveryKey), user.recoveryHash)) {
    return { ok: false, error: "That username + recovery key don't match." };
  }
  const newRecovery = generateRecoveryKey();
  await db.collection("users").updateOne(
    { _id: user._id },
    { $set: { passwordHash: hashSecret(newPassword), recoveryHash: hashSecret(normKey(newRecovery)) } }
  );
  await setSession(user._id.toString());
  return { ok: true, recoveryKey: newRecovery };
}

export async function getUser(): Promise<User | null> {
  if (!process.env.MONGODB_URI) return null;
  let token: string | undefined;
  try {
    token = (await cookies()).get(COOKIE)?.value;
  } catch {
    return null;
  }
  if (!token) return null;
  const uid = unsign(token);
  if (!uid) return null;
  try {
    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(uid) });
    if (!user) return null;
    return { id: uid, username: user.display || user.username, role: (user.role as Role) || "learner" };
  } catch {
    return null;
  }
}

export async function currentUserId(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? unsign(token) : null;
}
