import {
    DepartmentModel,
    admin_log,
    action_log
} from "../../common/models.js";

export const create_department = async (req, res) => {
    try {
        const currentAdmin = req.admin;
        const { name, code, faculty_id } = req.body;

        // Check if department with same name or code already exists under the same faculty
        const existing = await DepartmentModel.findOne({ name, faculty_id });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Department already exists in this faculty",
            });
        }

        const newDept = new DepartmentModel({
            name,
            code,
            faculty_id,
            created_by: currentAdmin._id,
        });

        await newDept.save();

        await admin_log.create({
            description: `Department created: ${newDept.name}`,
            unique_id: Date.now(),
            type: 1,
            admin_id: currentAdmin._id,
            referece_id: newDept._id,
        });

        await action_log.create({
            unique_id: Date.now(),
            reference_id: newDept._id,
            admin_id: currentAdmin._id,
            before: {},
            after: newDept.toObject(),
            table: "departments",
            modified_by: 1,
            action: 1, // 1 = create
        });

        return res.status(201).json({
            success: true,
            department: {
                _id: newDept._id,
                name: newDept.name,
                code: newDept.code,
                faculty_id: newDept.faculty_id,
                created_by: newDept.created_by,
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

export const update_department = async (req, res) => {
    try {
        const { department_id, ...updateData } = req.body;
        const currentAdmin = req.admin;

        const beforeDept = await DepartmentModel.findById(department_id).lean();
        if (!beforeDept) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        const updated = await DepartmentModel.findByIdAndUpdate(department_id, updateData, {
            new: true,
        });

        await admin_log.create({
            description: `Department updated: ${updated.name}`,
            unique_id: Date.now(),
            type: 2, // update
            admin_id: currentAdmin._id,
            referece_id: updated._id,
        });

        await action_log.create({
            unique_id: Date.now(),
            reference_id: updated._id,
            admin_id: currentAdmin._id,
            before: beforeDept,
            after: updated.toObject(),
            table: "departments",
            modified_by: 1,
            action: 2, // update
        });

        return res.json({ success: true, department: updated });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Update failed",
            error: err.message,
        });
    }
};

export const disable_department = async (req, res) => {
    try {
        const { department_id } = req.body;
        const currentAdmin = req.admin;

        const dept = await DepartmentModel.findById(department_id);
        if (!dept) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        const before = dept.toObject();
        dept.status = 0;
        await dept.save();

        await admin_log.create({
            description: `Disabled department: ${dept.name}`,
            unique_id: Date.now(),
            type: 3,
            admin_id: currentAdmin._id,
            referece_id: dept._id,
        });

        await action_log.create({
            unique_id: Date.now(),
            reference_id: dept._id,
            admin_id: currentAdmin._id,
            before,
            after: dept.toObject(),
            table: "departments",
            modified_by: 1,
            action: 6,
        });

        return res.json({ success: true, message: "Department disabled", department: dept });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

export const reactivate_department = async (req, res) => {
    try {
        const { department_id } = req.body;
        const currentAdmin = req.admin;

        const dept = await DepartmentModel.findById(department_id);
        if (!dept) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        const before = dept.toObject();
        dept.status = 1;
        await dept.save();

        await admin_log.create({
            description: `Reactivated department: ${dept.name}`,
            unique_id: Date.now(),
            type: 5,
            admin_id: currentAdmin._id,
            referece_id: dept._id,
        });

        await action_log.create({
            unique_id: Date.now(),
            reference_id: dept._id,
            admin_id: currentAdmin._id,
            before,
            after: dept.toObject(),
            table: "departments",
            modified_by: 1,
            action: 8,
        });

        return res.json({ success: true, message: "Department reactivated", department: dept });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

export const get_department_by_id = async (req, res) => {
    try {
        const { department_id } = req.body;

        const department = await DepartmentModel.findById(department_id).populate("faculty_id", "name").lean();
        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        return res.json({ success: true, department });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};


export const get_departments = async (req, res) => {
    try {
        const list = await DepartmentModel.find().populate("faculty_id", "name").sort({ createdAt: -1 });
        return res.json({ success: true, departments: list });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error fetching departments" });
    }
};
