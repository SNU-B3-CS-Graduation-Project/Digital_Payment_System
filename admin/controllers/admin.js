import {
  action_log,
  admin_log,
  admin as AdminModel
} from "../../common/models.js";
import bcrypt from "bcrypt";

// Create a new admin
export const create_admin = async (req, res) => {
  try {
    const currentAdmin = req.admin;

    const { username, full_name, email, password, role } = req.body;

    const existing = await AdminModel.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminModel({
      username,
      full_name,
      email,
      password: hashedPassword,
      role,
      created_by: currentAdmin._id,
    });

    await newAdmin.save();

    await admin_log.create({
      description: `Admin created: ${newAdmin.full_name}`,
      unique_id: Date.now(),
      type: 1,
      admin_id: currentAdmin._id,
      referece_id: newAdmin._id,
    });

    await action_log.create({
      unique_id: Date.now(),
      reference_id: newAdmin._id,
      admin_id: currentAdmin._id,
      before: {},
      after: newAdmin.toObject(),
      table: "admins",
      modified_by: 1,
      action: 1, // Create
    });

    return res.status(201).json({
      success: true,
      admin: {
        _id: newAdmin._id,
        username: newAdmin.username,
        full_name: newAdmin.full_name,
        email: newAdmin.email,
        role: newAdmin.role,
        created_by: newAdmin.created_by,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// Get all admins
export const get_admins = async (req, res) => {
  try {
    const admins = await AdminModel.find()
      .select({
        password: 0,
        login_attempts: 0,
        login_attempts_at: 0,
        login_at: 0,
        ip_address: 0,
        server_token: 0,
        urls: 0,
        menus: 0,
      });

    return res.json({
      success: true,
      admins,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
      error: err.message,
    });
  }
};

// Get admin detail by ID (from body)
export const get_admin_by_id = async (req, res) => {
  try {
    const { admin_id } = req.body;

    const admin = await AdminModel.findById(admin_id).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.json({
      success: true,
      admin,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching admin",
      error: err.message,
    });
  }
};

// Update admin
export const update_admin = async (req, res) => {
  try {
    const { admin_id, ...updateData } = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const beforeAdmin = await AdminModel.findById(admin_id).lean();
    const updated = await AdminModel.findByIdAndUpdate(admin_id, updateData, {
      new: true,
    }).select("-password");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    await admin_log.create({
      description: `Admin updated: ${updated.full_name}`,
      unique_id: Date.now(),
      type: 2,
      admin_id: req.admin._id,
      referece_id: updated._id,
    });

    await action_log.create({
      unique_id: Date.now(),
      reference_id: updated._id,
      admin_id: req.admin._id,
      before: beforeAdmin,
      after: updated.toObject(),
      table: "admins",
      modified_by: 1,
      action: 2, // Update
    });

    return res.json({ success: true, admin: updated });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
};

// Blacklist admin
export const blacklist_admin = async (req, res) => {
  try {
    const { admin_id } = req.body;

    const beforeAdmin = await AdminModel.findById(admin_id).lean();
    const updated = await AdminModel.findByIdAndUpdate(admin_id, { is_blacklisted: true }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    await admin_log.create({
      description: `Admin blacklisted: ${updated.full_name}`,
      unique_id: Date.now(),
      type: 3,
      admin_id: req.admin._id,
      referece_id: updated._id,
    });

    await action_log.create({
      unique_id: Date.now(),
      reference_id: updated._id,
      admin_id: req.admin._id,
      before: beforeAdmin,
      after: updated.toObject(),
      table: "admins",
      modified_by: 1,
      action: 6, // Blacklist
    });

    return res.json({ success: true, message: "Admin blacklisted", admin: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Unblacklist admin
export const unblacklist_admin = async (req, res) => {
  try {
    const { admin_id } = req.body;

    const beforeAdmin = await AdminModel.findById(admin_id).lean();
    const updated = await AdminModel.findByIdAndUpdate(
      admin_id,
      { is_blacklisted: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    await admin_log.create({
      description: `Admin unblacklisted: ${updated.full_name}`,
      unique_id: Date.now(),
      type: 4,
      admin_id: req.admin._id,
      referece_id: updated._id,
    });

    await action_log.create({
      unique_id: Date.now(),
      reference_id: updated._id,
      admin_id: req.admin._id,
      before: beforeAdmin,
      after: updated.toObject(),
      table: "admins",
      modified_by: 1,
      action: 7, // Unblacklist
    });

    return res.json({
      success: true,
      message: "Admin removed from blacklist",
      admin: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};