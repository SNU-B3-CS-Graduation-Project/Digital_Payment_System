import express from "express";
import {
    create_faculty,
    update_faculty,
    get_faculties,
    disable_faculty,
    reactivate_faculty,
    get_faculty_by_id,
} from "../controllers/faculty.js";
// import { verifyToken, isSuperAdmin } from "../../middlewares/adminAuth.js";
import { isLoggedIn, isSuperAdmin } from "../../middlewares/adminAuth.js";


const router = express.Router();
export default function registerFacultyRoutes(app) {
    // Create faculty
    app.route("/admin/create_faculty").post(isLoggedIn, isSuperAdmin, create_faculty);

    // Update faculty
    app.route("/admin/update_faculty").post(isLoggedIn, isSuperAdmin, update_faculty);

    // disable faculty
    app.route("/admin/disable_faculty").post(isLoggedIn, isSuperAdmin, disable_faculty);

    // reactive faculty
    app.route("/admin/reactivate_faculty").post(isLoggedIn, isSuperAdmin, reactivate_faculty);

    // Get faculties
    app.route("/admin/get_faculties").post(isLoggedIn, isSuperAdmin, get_faculties);

    // Get faculty by ID
    app.route("/admin/get_faculty_by_id").post(isLoggedIn, isSuperAdmin, get_faculty_by_id);
}
