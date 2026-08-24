import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type Store = Record<string, Record<string, "todo" | "doing" | "done">>;
const rank = { todo: 0, doing: 1, done: 2 } as const;

function merge(a: Store, b: Store): Store {
  const out: Store = JSON.parse(JSON.stringify(a || {}));
  for (const slug of Object.keys(b || {})) {
    out[slug] = out[slug] || {};
    for (const node of Object.keys(b[slug])) {
      const cur = out[slug][node];
      const inc = b[slug][node];
      if (!cur || rank[inc] > rank[cur]) out[slug][node] = inc;
    }
  }
  return out;
}

export async function GET() {
  const uid = await currentUserId();
  if (!uid) return NextResponse.json({ progress: {} }, { status: 401 });
  const db = await getDb();
  const doc = await db.collection("progress").findOne({ userId: uid });
  return NextResponse.json({ progress: (doc?.data as Store) || {} });
}

export async function POST(req: Request) {
  const uid = await currentUserId();
  if (!uid) return NextResponse.json({ progress: {} }, { status: 401 });
  let incoming: Store = {};
  try {
    incoming = (await req.json())?.progress || {};
  } catch {}
  const db = await getDb();
  const doc = await db.collection("progress").findOne({ userId: uid });
  const merged = merge((doc?.data as Store) || {}, incoming);
  await db.collection("progress").updateOne(
    { userId: uid },
    { $set: { userId: uid, data: merged, updatedAt: new Date() } },
    { upsert: true }
  );
  return NextResponse.json({ progress: merged });
}
