const departmentRepository = require('../repositories/departmentRepository');
const userRepository = require('../repositories/userRepository');

class DepartmentService {
  async getAllDepartments() {
    return await departmentRepository.findAll();
  }

  async getDepartmentById(id) {
    const dept = await departmentRepository.findById(id);
    if (!dept) {
      throw new Error('Department not found');
    }
    return dept;
  }

  async createDepartment(data) {
    // Check code uniqueness
    const existing = await departmentRepository.findByCode(data.department_code);
    if (existing) {
      throw new Error('Department code must be unique');
    }

    // Validate head if provided
    if (data.department_head) {
      const user = await userRepository.findById(data.department_head);
      if (!user) {
        throw new Error('Assigned department head user not found');
      }
    }

    const insertId = await departmentRepository.create(data);
    return await departmentRepository.findById(insertId);
  }

  async updateDepartment(id, data) {
    const dept = await departmentRepository.findById(id);
    if (!dept) {
      throw new Error('Department not found');
    }

    // Check code uniqueness
    if (data.department_code && data.department_code !== dept.department_code) {
      const existing = await departmentRepository.findByCode(data.department_code);
      if (existing) {
        throw new Error('Department code must be unique');
      }
    }

    // Validate head if provided
    if (data.department_head) {
      const user = await userRepository.findById(data.department_head);
      if (!user) {
        throw new Error('Assigned department head user not found');
      }
    }

    const updated = await departmentRepository.update(id, {
      ...dept,
      ...data
    });

    if (!updated) {
      throw new Error('Failed to update department');
    }

    return await departmentRepository.findById(id);
  }

  /**
   * Delete department (ON DELETE RESTRICT is safe-checked at service level)
   */
  async deleteDepartment(id) {
    const dept = await departmentRepository.findById(id);
    if (!dept) {
      throw new Error('Department not found');
    }

    // Check if employees exist
    const hasUsers = await departmentRepository.hasEmployees(id);
    if (hasUsers) {
      throw new Error('Cannot delete department. Active employees are currently assigned to it. Re-assign employees first.');
    }

    return await departmentRepository.delete(id);
  }
}

module.exports = new DepartmentService();
