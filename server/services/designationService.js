const designationRepository = require('../repositories/designationRepository');
const departmentRepository = require('../repositories/departmentRepository');

class DesignationService {
  async getAllDesignations(departmentId) {
    return await designationRepository.findAll(departmentId);
  }

  async getDesignationById(id) {
    const desig = await designationRepository.findById(id);
    if (!desig) {
      throw new Error('Designation not found');
    }
    return desig;
  }

  async createDesignation(data) {
    // Validate department exists
    const dept = await departmentRepository.findById(data.department_id);
    if (!dept) {
      throw new Error('Invalid department selection');
    }

    const insertId = await designationRepository.create(data);
    return await designationRepository.findById(insertId);
  }

  async updateDesignation(id, data) {
    const desig = await designationRepository.findById(id);
    if (!desig) {
      throw new Error('Designation not found');
    }

    if (data.department_id) {
      const dept = await departmentRepository.findById(data.department_id);
      if (!dept) {
        throw new Error('Invalid department selection');
      }
    }

    const updated = await designationRepository.update(id, {
      ...desig,
      ...data
    });

    if (!updated) {
      throw new Error('Failed to update designation');
    }

    return await designationRepository.findById(id);
  }

  async deleteDesignation(id) {
    const desig = await designationRepository.findById(id);
    if (!desig) {
      throw new Error('Designation not found');
    }

    // Restrict deletion if users hold this designation
    const hasUsers = await designationRepository.hasEmployees(id);
    if (hasUsers) {
      throw new Error('Cannot delete designation. Active employees hold this designation. Re-assign employees first.');
    }

    return await designationRepository.delete(id);
  }
}

module.exports = new DesignationService();
