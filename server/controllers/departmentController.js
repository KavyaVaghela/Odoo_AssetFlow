const departmentService = require('../services/departmentService');
const response = require('../utils/response');

class DepartmentController {
  async getDepartments(req, res, next) {
    try {
      const departments = await departmentService.getAllDepartments();
      return response.success(res, 'Departments retrieved successfully', departments);
    } catch (err) {
      next(err);
    }
  }

  async getDepartment(req, res, next) {
    try {
      const { id } = req.params;
      const dept = await departmentService.getDepartmentById(id);
      return response.success(res, 'Department details retrieved successfully', dept);
    } catch (err) {
      next(err);
    }
  }

  async createDepartment(req, res, next) {
    try {
      const data = req.body;
      if (!data.department_name || !data.department_code) {
        return response.error(res, 'department_name and department_code are required', 400);
      }

      const dept = await departmentService.createDepartment(data);
      return response.success(res, 'Department created successfully', dept, 201);
    } catch (err) {
      next(err);
    }
  }

  async updateDepartment(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!data.department_name || !data.department_code) {
        return response.error(res, 'department_name and department_code are required', 400);
      }

      const dept = await departmentService.updateDepartment(id, data);
      return response.success(res, 'Department updated successfully', dept);
    } catch (err) {
      next(err);
    }
  }

  async deleteDepartment(req, res, next) {
    try {
      const { id } = req.params;
      await departmentService.deleteDepartment(id);
      return response.success(res, 'Department deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DepartmentController();
