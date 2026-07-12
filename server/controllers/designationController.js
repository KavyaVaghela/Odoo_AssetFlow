const designationService = require('../services/designationService');
const response = require('../utils/response');

class DesignationController {
  async getDesignations(req, res, next) {
    try {
      const { department_id } = req.query;
      const designations = await designationService.getAllDesignations(department_id);
      return response.success(res, 'Designations retrieved successfully', designations);
    } catch (err) {
      next(err);
    }
  }

  async getDesignation(req, res, next) {
    try {
      const { id } = req.params;
      const desig = await designationService.getDesignationById(id);
      return response.success(res, 'Designation details retrieved successfully', desig);
    } catch (err) {
      next(err);
    }
  }

  async createDesignation(req, res, next) {
    try {
      const data = req.body;
      if (!data.designation_name || !data.department_id) {
        return response.error(res, 'designation_name and department_id are required', 400);
      }

      const desig = await designationService.createDesignation(data);
      return response.success(res, 'Designation created successfully', desig, 201);
    } catch (err) {
      next(err);
    }
  }

  async updateDesignation(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!data.designation_name || !data.department_id) {
        return response.error(res, 'designation_name and department_id are required', 400);
      }

      const desig = await designationService.updateDesignation(id, data);
      return response.success(res, 'Designation updated successfully', desig);
    } catch (err) {
      next(err);
    }
  }

  async deleteDesignation(req, res, next) {
    try {
      const { id } = req.params;
      await designationService.deleteDesignation(id);
      return response.success(res, 'Designation deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DesignationController();
