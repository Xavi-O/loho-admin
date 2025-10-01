// File: lib/readonlyDb.ts
// lib/readonlyDb.ts
import mongoose from "mongoose"

const MONGODB_URI = process.env.READONLY_MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("Missing READONLY_MONGODB_URI")
}

let cached = (global as any).readonlyMongoose

if (!cached) {
  cached = (global as any).readonlyMongoose = { conn: null, promise: null }
}

export async function connectReadOnlyDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.createConnection(MONGODB_URI, {
      bufferCommands: false,
    }).asPromise()
  }

  cached.conn = await cached.promise
  return cached.conn
}