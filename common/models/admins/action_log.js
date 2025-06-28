import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema(
  {
    unique_id: { type: Number },

    reference_id: { type: mongoose.Schema.Types.ObjectId, default: null },

    admin_id: { type: mongoose.Schema.Types.ObjectId, default: null },

    before: {
      type: Object,
      default: {},
    },

    after: {
      type: Object,
      default: {},
    },

    table: {
      type: String,
      default: "",
    },

    modified_by: { type: Number, default: 0 }, // 1: admin, 2: store

    action: { type: Number, default: 0 }, // 1: create, 2: update, 3: approve, 4: decline, 5: upload image, 6: delete image
  },
  {
    strict: true,
    usePushEach: true,
    timestamps: true,
},
);

export default mongoose.model("action_log", actionLogSchema);
