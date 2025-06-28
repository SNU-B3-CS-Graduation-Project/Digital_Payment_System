import admin from './models/admins/admin.js';
import menus from './models/admins/menu.js';
import { BlacklistedToken } from './models/admins/blacklist_token.js';
import admin_log from './models/admins/admin_log.js';
import action_log from './models/admins/action_log.js';
import FacultyModel from './models/admins/faculties.js';
import DepartmentModel from './models/admins/departments.js';

export {
    admin,
    BlacklistedToken,
    admin_log,
    action_log,
    FacultyModel,
    DepartmentModel,
    menus,
};
