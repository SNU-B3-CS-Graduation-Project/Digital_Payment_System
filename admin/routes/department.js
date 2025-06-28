import express from "express";
import {
    create_department,
    update_department,
    get_departments,
    disable_department,
    reactivate_department,
    get_department_by_id,
} from "../controllers/department.js";
// import { verifyToken, isSuperAdmin } from "../../middlewares/adminAuth.js";
import { isLoggedIn, isSuperAdmin } from "../../middlewares/adminAuth.js";


const router = express.Router();
export default function registerDepartmentRoutes(app) {
    // Create department
    app.route("/admin/create_department").post(isLoggedIn, isSuperAdmin, create_department);

    // Update department
    app.route("/admin/update_department").post(isLoggedIn, isSuperAdmin, update_department);

    // disable department
    app.route("/admin/disable_department").post(isLoggedIn, isSuperAdmin, disable_department);

    // reactive department
    app.route("/admin/reactivate_department").post(isLoggedIn, isSuperAdmin, reactivate_department);

    // Get departments
    app.route("/admin/get_departments").post(isLoggedIn, isSuperAdmin, get_departments);

    // Get department by ID
    app.route("/admin/get_department_by_id").post(isLoggedIn, isSuperAdmin, get_department_by_id);
}