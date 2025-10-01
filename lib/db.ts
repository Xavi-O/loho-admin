// File: lib/db.ts
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not defined');
  console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  throw new Error('Please define the MONGODB_URI environment variable in your .env file');
}

// Extend the Node.js global object to include a mongoose cache
declare global {
  var mongooseCache: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

// Initialize global cache if it doesn't exist
global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

const cached = global.mongooseCache;

async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    console.log('🔄 Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔌 Creating new MongoDB connection...');
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${cached.conn.connection.name}`);
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;