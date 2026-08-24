import "server-only";
import { MongoClient, type Db } from "mongodb";

// Cached client across HMR / serverless invocations.
declare global {
  // eslint-disable-next-line no-var
  var _exvMongo: Promise<MongoClient> | undefined;
}

function client(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!global._exvMongo) {
    global._exvMongo = new MongoClient(uri, { appName: "exverse" }).connect();
  }
  return global._exvMongo;
}

let indexed = false;

export async function getDb(): Promise<Db> {
  const c = await client();
  const db = c.db(process.env.MONGODB_DB || "exverse");
  if (!indexed) {
    indexed = true;
    await Promise.all([
      db.collection("users").createIndex({ username: 1 }, { unique: true }),
      db.collection("progress").createIndex({ userId: 1 }, { unique: true }),
    ]).catch(() => {});
  }
  return db;
}

export function hasDb(): boolean {
  return Boolean(process.env.MONGODB_URI);
}
