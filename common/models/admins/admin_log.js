import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    description: { type: String, default: "" },

    unique_id: { type: Number },

    type: { type: Number, default: 0 },

    admin_id: { type: mongoose.Schema.Types.ObjectId },

    referece_id: { type: mongoose.Schema.Types.ObjectId },
  },
  {
    strict: true,
    timestamps: true,
  }
);

export default mongoose.model("admin_log", adminLogSchema);
