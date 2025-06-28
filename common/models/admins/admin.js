import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, default: "" },
    password: { type: String, required: true },
    server_token: { type: String, default: "" },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    urls: [{ type: String }],

    full_name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },

    role: {
      type: String,
      enum: ["super_admin", "finance_admin"],
      default: "finance_admin",
    },

    status: { type: Number, default: 0 },

    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },

    admin_type: { type: Number, default: 0 },

    has_full_access: { type: Boolean, default: false },
    login_attempts: { type: Number, default: 0 },
    login_at: { type: Date, default: null },

    login_attempts_at: { type: Date, default: null },
    ip_address: { type: String, default: "" },

    is_developer: { type: Boolean, default: false },

    is_blacklisted: { type: Boolean, default: false },


    sent_otp_at: { type: Date, default: null },
    otp_code: { type: Number, default: 0 },

    can_pay_side_payment: { type: Boolean, default: false },
    can_approve_side_payment: { type: Boolean, default: false },
    can_see_main_categories_and_payment_options: {
      type: Boolean,
      default: false,
    },
    can_see_sensitive_pages: { type: Boolean, default: false },
    can_see_admin_otp: { type: Boolean, default: false },

    menus: [{ type: String }],

  },
  {
    timestamps: true,
    strict: true,
  }
);

// Add compound indexes for better querying
adminSchema.index({ email: 1, admin_type: 1 }, { background: true });
adminSchema.index({ username: 1, password: 1 }, { background: true });
adminSchema.index({ email: 1, password: 1 }, { background: true });

export default mongoose.model("admin", adminSchema);