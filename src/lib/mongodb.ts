import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define the interface for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global type
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize the cache
const cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

// Store the cache back to global if it wasn't there
if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose | null> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (MONGODB_URI) {
      cached.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then((mongooseInstance) => {
          return mongooseInstance;
        });
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
