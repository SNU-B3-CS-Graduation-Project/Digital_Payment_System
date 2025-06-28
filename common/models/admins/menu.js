import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
    {
        sqn: { type: Number },
        title: { type: String, required: true, trim: true },
        url: { type: String, default: "", trim: true },
        icon: { type: String, default: "", trim: true },

        type: { type: Number, default: 0 }, // 0: parent, 1: child
        is_special: { type: Number, default: 0 },
        status: { type: Number, default: 1 }, // 1: active, 0: inactive

        parent_id: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "menu" },
        created_by: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "admin" },

        portal_type: { type: String, default: "", trim: true },
        is_for_manager: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        strict: true,
    }
);

// Indexes for efficient querying
menuSchema.index({ title: 1, portal_type: 1 }, { background: true });
menuSchema.index({ parent_id: 1, portal_type: 1 }, { background: true });

export default mongoose.model("menu", menuSchema);
