const mongoose = require("mongoose");

const RETRY_MS = 15000;

// Keep trying instead of exiting. If the database is down or paused, the API stays up,
// /health reports it, and requests fail with a clear error instead of the whole server
// crash-looping on Render.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}. Retrying in ${RETRY_MS / 1000}s.`);
    setTimeout(connectDB, RETRY_MS);
  }
};

module.exports = connectDB;
