const userRepository = require('../repositories/userRepository');
const departmentRepository = require('../repositories/departmentRepository');
const designationRepository = require('../repositories/designationRepository');
const roleRepository = require('../repositories/roleRepository');
const bcrypt = require('bcryptjs');

class UserService {
  /**
   * Fetch paginated list of users
   */
  async getAllUsers(filters) {
    return await userRepository.findAll(filters);
  }

  /**
   * Fetch specific user details
   */
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    // 1. Validate email uniqueness
    const existingEmail = await userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email is already registered');
    }

    // 2. Validate employee code uniqueness
    const existingCode = await userRepository.findByEmployeeCode(userData.employee_code);
    if (existingCode) {
      throw new Error('Employee code is already registered');
    }

    // 3. Validate department if provided
    if (userData.department_id) {
      const dept = await departmentRepository.findById(userData.department_id);
      if (!dept) {
        throw new Error('Invalid department selection');
      }
    }

    // 4. Validate designation if provided
    if (userData.designation_id) {
      const desig = await designationRepository.findById(userData.designation_id);
      if (!desig) {
        throw new Error('Invalid designation selection');
      }
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(10);
    userData.password_hash = await bcrypt.hash(userData.password || 'Password123', salt);

    // 6. Create user
    const insertId = await userRepository.create(userData);
    return await userRepository.findById(insertId);
  }

  /**
   * Update user details
   */
  async updateUser(id, userData) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // 1. Email uniqueness check
    if (userData.email && userData.email !== user.email) {
      const existingEmail = await userRepository.findByEmail(userData.email);
      if (existingEmail) {
        throw new Error('Email is already registered');
      }
    }

    // 2. Validate department if provided
    if (userData.department_id) {
      const dept = await departmentRepository.findById(userData.department_id);
      if (!dept) {
        throw new Error('Invalid department selection');
      }
    }

    // 3. Validate designation if provided
    if (userData.designation_id) {
      const desig = await designationRepository.findById(userData.designation_id);
      if (!desig) {
        throw new Error('Invalid designation selection');
      }
    }

    const updated = await userRepository.update(id, {
      ...user,
      ...userData
    });

    if (!updated) {
      throw new Error('Failed to update user profile');
    }

    return await userRepository.findById(id);
  }

  /**
   * Delete user (restricted if user is a department head)
   */
  async deleteUser(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check circular head constraint: check if this user is a department head
    const depts = await departmentRepository.findAll();
    const isHeadOf = depts.find(d => d.department_head === parseInt(id, 10));
    if (isHeadOf) {
      throw new Error(`Cannot delete user. Employee is the Head of the ${isHeadOf.department_name} Department. Relieve the user from department head duties first.`);
    }

    return await userRepository.delete(id);
  }

  /**
   * Assign a role to a user
   */
  async assignRole(userId, roleId, assignedBy) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    return await userRepository.assignRole(userId, roleId, assignedBy);
  }

  /**
   * Revoke a role from a user
   */
  async revokeRole(userId, roleId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Do not allow revoking role if it is the only role remaining
    if (user.roles.length <= 1 && user.roles.some(r => r.id === parseInt(roleId, 10))) {
      throw new Error('A user must have at least one active role assignment.');
    }

    return await userRepository.revokeRole(userId, roleId);
  }
}

module.exports = new UserService();
