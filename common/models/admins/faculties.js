import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true }, // e.g., SCI for Science
  tuition_fee: { type: Number, required: true }, // per semester
  status: { type: Number, default: 1 }, // 1 = active, 0 = inactive
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
}, {
  timestamps: true,
});

export default mongoose.model("faculty", facultySchema);
