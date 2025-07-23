// lib/dbConnect.js
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://theadarshsahu:UC8kISxJHngcB5a9@cluster0.ksus6tq.mongodb.net/';
if (!MONGO_URI) {
  throw new Error('❌ .env MONGODB_URI must be defined');
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
