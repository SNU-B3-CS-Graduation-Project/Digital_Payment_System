import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiredAt: { type: Date, required: true },
});

export const BlacklistedToken = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
