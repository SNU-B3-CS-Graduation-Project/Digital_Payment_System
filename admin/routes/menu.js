import {
    create_menu,
    delete_menu,
    get_menus,
    update_menu
} from "../controllers/menu.js";

import { isLoggedIn, isSuperAdmin } from "../../middlewares/adminAuth.js";

export default (app) => {
    // Admin Menu Routes
    app.route("/admin/create_menu").post(isLoggedIn, isSuperAdmin, create_menu);

    app.route("/admin/get_menus").get(isLoggedIn, isSuperAdmin, get_menus);

    app.route("/admin/update_menu").post(isLoggedIn, isSuperAdmin, update_menu);

    app.route("/admin/delete_menu").post(isLoggedIn, isSuperAdmin, delete_menu);

};
