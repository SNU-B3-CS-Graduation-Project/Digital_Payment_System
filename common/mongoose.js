import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default function connectDB() {
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.PROD_DB_URL
      : process.env.DEV_DB_URL;

  console.log("🌐 Connecting to MongoDB:", url);
  mongoose
    .connect(url)
    .then(() => console.log("✅ DB connection successful"))
    .catch((err) => console.error("❌ DB connection error:", err));
}