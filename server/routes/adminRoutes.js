import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { validateResult, employeeValidation, departmentValidation, roleValidation, categoryValidation, idParamValidation } from '../validators/adminValidator.js';

// Controllers
import { getDashboardStats } from '../controllers/dashboardController.js';
import { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, approveEmployee, rejectEmployee, activateEmployee, deactivateEmployee, getPendingUsers } from '../controllers/employeeController.js';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../controllers/departmentController.js';
import { getRoles, createRole, updateRole, deleteRole, assignRoleToEmployee, removeRoleFromEmployee, getPermissions, createPermission, assignPermissionToRole, removePermissionFromRole } from '../controllers/rolePermissionController.js';
import { getCategories, createCategory, updateCategory, deleteCategory, getSettings, updateSettings, uploadLogo } from '../controllers/categorySettingsController.js';
import { getActivityLogs } from '../controllers/activityLogController.js';

const router = express.Router();

// All routes here are protected and require 'Admin' role
router.use(protect);
router.use(authorizeRoles('Admin'));

// --- Dashboard ---
router.get('/dashboard', getDashboardStats);

// --- Employee Management ---
router.get('/employees', getEmployees);
router.get('/employees/:id', idParamValidation, validateResult, getEmployeeById);
router.post('/employees', employeeValidation, validateResult, createEmployee);
router.put('/employees/:id', [...idParamValidation, ...employeeValidation], validateResult, updateEmployee);
router.delete('/employees/:id', idParamValidation, validateResult, deleteEmployee);

router.get('/pending-users', getPendingUsers);
router.put('/approve/:id', idParamValidation, validateResult, approveEmployee);
router.put('/reject/:id', idParamValidation, validateResult, rejectEmployee);
router.put('/activate/:id', idParamValidation, validateResult, activateEmployee);
router.put('/deactivate/:id', idParamValidation, validateResult, deactivateEmployee);

// --- Department Management ---
router.get('/departments', getDepartments);
router.post('/departments', departmentValidation, validateResult, createDepartment);
router.put('/departments/:id', [...idParamValidation, ...departmentValidation], validateResult, updateDepartment);
router.delete('/departments/:id', idParamValidation, validateResult, deleteDepartment);

// --- Role Management ---
router.get('/roles', getRoles);
router.post('/roles', roleValidation, validateResult, createRole);
router.put('/roles/:id', [...idParamValidation, ...roleValidation], validateResult, updateRole);
router.delete('/roles/:id', idParamValidation, validateResult, deleteRole);

router.post('/roles/assign', assignRoleToEmployee);
router.post('/roles/remove', removeRoleFromEmployee);

// --- Permission Management ---
router.get('/permissions', getPermissions);
router.post('/permissions', createPermission);
router.post('/permissions/assign', assignPermissionToRole);
router.post('/permissions/remove', removePermissionFromRole);

// --- Asset Category Management ---
router.get('/categories', getCategories);
router.post('/categories', categoryValidation, validateResult, createCategory);
router.put('/categories/:id', [...idParamValidation, ...categoryValidation], validateResult, updateCategory);
router.delete('/categories/:id', idParamValidation, validateResult, deleteCategory);

// --- Settings ---
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/settings/upload-logo', upload.single('logo'), uploadLogo);

// --- Activity Logs ---
router.get('/logs', getActivityLogs);

export default router;
