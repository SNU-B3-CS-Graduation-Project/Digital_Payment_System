import {
    FacultyModel,
    admin_log,
    action_log,
    DepartmentModel
} from "../../common/models.js";

export const create_faculty = async (req, res) => {
    try {
        const { name, code, tuition_fee } = req.body;
        const currentAdmin = req.admin;

        const exists = await FacultyModel.findOne({ name });
        if (exists) return res.status(400).json({ success: false, message: "Faculty already exists" });

        const newFaculty = new FacultyModel({
            name,
            code,
            tuition_fee,
            created_by: currentAdmin._id,
        });

        await newFaculty.save();

        await admin_log.create({
            description: `Created faculty: ${name}`,
            unique_id: Date.now(),
            type: 1,
            admin_id: currentAdmin._id,
            referece_id: newFaculty._id,
        });

        await action_log.create({
            unique_id: Date.now(),
            reference_id: newFaculty._id,
            admin_id: currentAdmin._id,
            before: {},
            after: newFaculty.toObject(),
            table: "faculties",
            modified_by: 1,
            action: 1,
        });

        return res.json({ success: true, message: "Faculty created", faculty: newFaculty });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

export const update_faculty = async (req, res) => {
    try {
        const { faculty_id, ...updateData } = req.body;
        const currentAdmin = req.admin;

        // Get the current data before update
        const beforeFaculty = await FacultyModel.findById(faculty_id).lean();
        if (!beforeFaculty) {
            return res.status(404).json({ success: false, message: "Faculty not found" });
        }

        const updated = await FacultyModel.findByIdAndUpdate(faculty_id, updateData, {
            new: true,
        });

        await admin_log.create({
            description: `Faculty updated: ${updated.name}`,
            unique_id: Date.now(),
            type: 2,
            admin_id: currentAdmin._id,
            referece_id: updated._id,
        });

        await action_log.create({
            unique_id: Date.now(),
            reference_id: updated._id,
            admin_id: currentAdmin._id,
            before: beforeFaculty,
            after: updated.toObject(),
            table: "faculties",
            modified_by: 1,
            action: 2, // Update
        });

        return res.json({ success: true, message: "Faculty updated", faculty: updated });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

export const disable_faculty = async (req, res) => {
    try {
        const { faculty_id } = req.body;
        const currentAdmin = req.admin;

        const faculty = await FacultyModel.findById(faculty_id);
        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty not found" });
        }

        const before = faculty.toObject();
        faculty.status = 0;
        await faculty.save();

        await admin_log.create({
            description: `Disabled faculty: ${faculty.name}`,
            unique_id: Date.now(),
            type: 3, // action type ( disable)
            admin_id: currentAdmin._id,
            referece_id: faculty._id,
        });

        await action_log.create({
            unique_id: Date.now(),
            reference_id: faculty._id,
            admin_id: currentAdmin._id,
            before,
            after: faculty.toObject(),
            table: "faculties",
            modified_by: 1,
            action: 6, // 6 = disable
        });

        return res.json({ success: true, message: "Faculty disabled", faculty });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

export const reactivate_faculty = async (req, res) => {
    try {
        const { faculty_id } = req.body;
        const currentAdmin = req.admin;

        const faculty = await FacultyModel.findById(faculty_id);
        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty not found" });
        }

        const before = faculty.toObject();
        faculty.status = 1;
        await faculty.save();

        await admin_log.create({
            description: `Reactivated faculty: ${faculty.name}`,
            unique_id: Date.now(),
            type: 5, // custom type for reactivation
            admin_id: currentAdmin._id,
            referece_id: faculty._id,
        });

        await action_log.create({
            unique_id: Date.now(),
            reference_id: faculty._id,
            admin_id: currentAdmin._id,
            before,
            after: faculty.toObject(),
            table: "faculties",
            modified_by: 1,
            action: 8, // custom action for reactivation
        });

        return res.json({ success: true, message: "Faculty reactivated", faculty });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};

export const get_faculty_by_id = async (req, res) => {
    try {
        const { faculty_id } = req.body;

        const faculty = await FacultyModel.findById(faculty_id).lean();
        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty not found" });
        }

        const departments = await DepartmentModel.find({ faculty_id }).lean();

        return res.json({
            success: true,
            faculty: {
                ...faculty,
                departments,
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};


export const get_faculties = async (req, res) => {
    try {
        const faculties = await FacultyModel.find().sort({ createdAt: -1 }).lean();

        // Get all departments once to avoid multiple DB calls
        const departments = await DepartmentModel.find().lean();

        // Map departments to their faculties
        const facultiesWithDepartments = faculties.map(faculty => {
            const facultyDepartments = departments.filter(dept => String(dept.faculty_id) === String(faculty._id));
            return {
                ...faculty,
                departments: facultyDepartments,
            };
        });

        return res.json({ success: true, faculties: facultiesWithDepartments });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error fetching faculties", error: err.message });
    }
};