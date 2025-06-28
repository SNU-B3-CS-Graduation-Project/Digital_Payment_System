import {
  menus as MenuModel,
  action_log,
  admin_log
} from "../../common/models.js";

// Create a new menu
export const create_menu = async (req, res) => {
  try {
    const currentAdmin = req.admin;
    const {
      title,
      url,
      is_submenus,
      parent,
      icon,
      ck_status,
      portal_type,
      is_special = 0
    } = req.body;

    const existingMenu = await MenuModel.findOne({ title });
    if (existingMenu) {
      return res.status(400).json({
        success: false,
        message: "This menu already exists!"
      });
    }

    const newMenu = new MenuModel({
      title,
      url,
      type: is_submenus,
      parent_id: is_submenus == 1 ? parent : null,
      icon,
      status: ck_status,
      portal_type,
      is_special: +is_special,
      created_by: currentAdmin._id
    });

    await newMenu.save();

    // Logs
    await admin_log.create({
      description: `Menu created: ${newMenu.title}`,
      unique_id: Date.now(),
      type: 1,
      admin_id: currentAdmin._id,
      referece_id: newMenu._id
    });

    await action_log.create({
      unique_id: Date.now(),
      reference_id: newMenu._id,
      admin_id: currentAdmin._id,
      before: {},
      after: newMenu.toObject(),
      table: "menus",
      modified_by: 1,
      action: 1
    });

    return res.json({
      success: true,
      message: "Menu created successfully",
      menu: newMenu
    });
  } catch (error) {
    console.error("Create menu error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update menu
export const update_menu = async (req, res) => {
  try {
    const currentAdmin = req.admin;
    const { menu_id, ...updateData } = req.body;

    const beforeMenu = await MenuModel.findById(menu_id).lean();
    const updated = await MenuModel.findByIdAndUpdate(menu_id, updateData, {
      new: true
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Menu not found"
      });
    }

    await admin_log.create({
      description: `Menu updated: ${updated.title}`,
      unique_id: Date.now(),
      type: 2,
      admin_id: currentAdmin._id,
      referece_id: updated._id
    });

    await action_log.create({
      unique_id: Date.now(),
      reference_id: updated._id,
      admin_id: currentAdmin._id,
      before: beforeMenu,
      after: updated.toObject(),
      table: "menus",
      modified_by: 1,
      action: 2
    });

    return res.json({
      success: true,
      message: "Menu updated",
      menu: updated
    });
  } catch (err) {
    console.error("Update menu error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get all menus
export const get_menus = async (req, res) => {
  try {
    const list = await MenuModel.find().sort({ createdAt: -1 });
    return res.json({ success: true, menus: list });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch menus"
    });
  }
};

// Delete menu
export const delete_menu = async (req, res) => {
  try {
    const currentAdmin = req.admin;
    const menu_id = req.body.menu_id;

    const beforeMenu = await MenuModel.findById(menu_id).lean();
    const deleted = await MenuModel.findByIdAndDelete(menu_id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Menu not found"
      });
    }

    await admin_log.create({
      description: `Menu deleted: ${beforeMenu?.title || "unknown"}`,
      unique_id: Date.now(),
      type: 5,
      admin_id: currentAdmin._id,
      referece_id: deleted._id
    });

    await action_log.create({
      unique_id: Date.now(),
      reference_id: deleted._id,
      admin_id: currentAdmin._id,
      before: beforeMenu,
      after: {},
      table: "menus",
      modified_by: 1,
      action: 6 // 6 = delete
    });

    return res.json({
      success: true,
      message: "Menu deleted",
      menu: deleted
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};
