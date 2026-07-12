const userService = require('../services/userService');
const response = require('../utils/response');

class UserController {
  /**
   * GET /api/admin/users
   * List users with filter and pagination
   */
  async getUsers(req, res, next) {
    try {
      const { search, status, departmentId, limit = 10, page = 1 } = req.query;
      
      const parsedLimit = parseInt(limit, 10);
      const parsedPage = parseInt(page, 10);
      const offset = (parsedPage - 1) * parsedLimit;

      const { rows, total } = await userService.getAllUsers({
        search,
        status,
        departmentId,
        limit: parsedLimit,
        offset
      });

      return response.success(res, 'Users retrieved successfully', {
        users: rows,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit)
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/users/:id
   * Get user profile details
   */
  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      return response.success(res, 'User profile retrieved successfully', user);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/users
   * Create user account
   */
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      
      // Simple validation check
      if (!userData.first_name || !userData.last_name || !userData.email || !userData.employee_code) {
        return response.error(res, 'Missing required fields: first_name, last_name, email, and employee_code are required.', 400);
      }

      const user = await userService.createUser(userData);
      
      // Remove sensitive password hash from response payload
      delete user.password_hash;

      return response.success(res, 'User account created successfully', user, 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/admin/users/:id
   * Update user details
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const userData = req.body;

      if (!userData.first_name || !userData.last_name || !userData.email) {
        return response.error(res, 'Missing required fields: first_name, last_name, and email are required.', 400);
      }

      const user = await userService.updateUser(id, userData);
      
      delete user.password_hash;

      return response.success(res, 'User profile updated successfully', user);
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/admin/users/:id
   * Delete user (restricted by department head constraints)
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      return response.success(res, 'User account deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/users/:id/roles
   * Assign role to user
   */
  async assignRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role_id } = req.body;

      if (!role_id) {
        return response.error(res, 'role_id is required', 400);
      }

      // In a real application, assignedBy is retrieved from req.user (authenticated user)
      const assignedBy = req.query.assigned_by || null; 

      await userService.assignRole(id, role_id, assignedBy);
      const user = await userService.getUserById(id);
      
      delete user.password_hash;

      return response.success(res, 'Role assigned to user successfully', user);
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/admin/users/:id/roles/:roleId
   * Revoke role from user
   */
  async revokeRole(req, res, next) {
    try {
      const { id, roleId } = req.params;
      await userService.revokeRole(id, roleId);
      const user = await userService.getUserById(id);
      
      delete user.password_hash;

      return response.success(res, 'Role revoked from user successfully', user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
