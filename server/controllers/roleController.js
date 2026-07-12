const roleService = require('../services/roleService');
const response = require('../utils/response');

class RoleController {
  async getRoles(req, res, next) {
    try {
      const roles = await roleService.getAllRoles();
      return response.success(res, 'Roles retrieved successfully', roles);
    } catch (err) {
      next(err);
    }
  }

  async getPermissions(req, res, next) {
    try {
      const permissions = await roleService.getAllPermissions();
      return response.success(res, 'Permissions retrieved successfully', permissions);
    } catch (err) {
      next(err);
    }
  }

  async getRole(req, res, next) {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleById(id);
      return response.success(res, 'Role details retrieved successfully', role);
    } catch (err) {
      next(err);
    }
  }

  async updateRolePermissions(req, res, next) {
    try {
      const { id } = req.params;
      const { permission_ids } = req.body;

      if (!Array.isArray(permission_ids)) {
        return response.error(res, 'permission_ids must be an array of numbers', 400);
      }

      await roleService.updateRolePermissions(id, permission_ids);
      const role = await roleService.getRoleById(id);
      return response.success(res, 'Role permissions synced successfully', role);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RoleController();
