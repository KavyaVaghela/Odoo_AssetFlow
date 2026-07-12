const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const departmentController = require('../controllers/departmentController');
const designationController = require('../controllers/designationController');
const roleController = require('../controllers/roleController');
const settingsController = require('../controllers/settingsController');
const activityLogController = require('../controllers/activityLogController');

// ==========================================
// 1. User Management Endpoints
// ==========================================
router.route('/users')
  .get(userController.getUsers)
  .post(userController.createUser);

router.route('/users/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

// Role Assignment & Revocation
router.post('/users/:id/roles', userController.assignRole);
router.delete('/users/:id/roles/:roleId', userController.revokeRole);

// ==========================================
// 2. Department Management Endpoints
// ==========================================
router.route('/departments')
  .get(departmentController.getDepartments)
  .post(departmentController.createDepartment);

router.route('/departments/:id')
  .get(departmentController.getDepartment)
  .put(departmentController.updateDepartment)
  .delete(departmentController.deleteDepartment);

// ==========================================
// 3. Designation Management Endpoints
// ==========================================
router.route('/designations')
  .get(designationController.getDesignations)
  .post(designationController.createDesignation);

router.route('/designations/:id')
  .get(designationController.getDesignation)
  .put(designationController.updateDesignation)
  .delete(designationController.deleteDesignation);

// ==========================================
// 4. Roles & Permissions Endpoints
// ==========================================
router.get('/roles', roleController.getRoles);
router.route('/roles/:id')
  .get(roleController.getRole)
  .put(roleController.updateRolePermissions); // Sync permission mapping

router.get('/permissions', roleController.getPermissions);

// ==========================================
// 5. System Settings Endpoints
// ==========================================
router.route('/settings')
  .get(settingsController.getSettings)
  .put(settingsController.updateSettings);

// ==========================================
// 6. Audit & Log Activity Endpoints
// ==========================================
router.get('/activity-logs', activityLogController.getActivityLogs);

module.exports = router;
