import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true },
  faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: "faculty", required: true },
  status: { type: Number, default: 1 },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
}, {
  timestamps: true,
});

export default mongoose.model("department", departmentSchema);
