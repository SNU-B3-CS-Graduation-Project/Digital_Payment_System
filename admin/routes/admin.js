import express from "express";
import {
  create_admin,
  get_admins,
  get_admin_by_id,
  update_admin,
  blacklist_admin,
  unblacklist_admin,
} from "../controllers/admin.js";
import { admin_login, admin_logout } from "../controllers/auth.js";

const router = express.Router();

// Middleware to check if the user is a super admin
import { isLoggedIn, isSuperAdmin } from "../../middlewares/adminAuth.js";

// Routes
export default function registerAdminRoutes(app) {
  // Create admin (POST)
  app.route("/admin/create_admin").post(isLoggedIn, isSuperAdmin, create_admin);

  // Get all admins (GET)
  app.route("/admin/get_admins").post(isLoggedIn, isSuperAdmin, get_admins);

  // Get admin by ID (GET)
  app.route("/admin/get_admin_by_id").post(isLoggedIn, isSuperAdmin, get_admin_by_id);

  // Update admin (PUT)
  app.route("/admin/update_admin").post(isLoggedIn, isSuperAdmin, update_admin);

  // Blacklist admin (POST)
  app.route("/admin/blacklist_admin").post(isLoggedIn, isSuperAdmin, blacklist_admin);

  // UnBlack admin (POST)
  app.route("/admin/unblacklist_admin").post(isLoggedIn, isSuperAdmin, unblacklist_admin);

  // Authentication routes
  app.route("/admin/login").post(admin_login);
  app.route("/admin/logout").post(admin_logout);


}