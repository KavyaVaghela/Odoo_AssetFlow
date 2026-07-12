import pool from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { logActivity } from '../services/activityLogService.js';
import { createNotification } from '../services/notificationService.js';

export const getDepartments = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM departments');
    return successResponse(res, 'Departments fetched successfully', rows);
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const { name, head_id } = req.body;
    const [result] = await pool.query('INSERT INTO departments (name, head_id) VALUES (?, ?)', [name, head_id]);
    
    await logActivity(req.user.id, 'Create Department', 'Department Management', `Created department ${name}`, req.ip);
    await createNotification(0, 'Department Created', `New department ${name} was created.`);

    return successResponse(res, 'Department created successfully', { id: result.insertId }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, head_id } = req.body;
    await pool.query('UPDATE departments SET name = ?, head_id = ? WHERE id = ?', [name, head_id, id]);
    
    await logActivity(req.user.id, 'Update Department', 'Department Management', `Updated department ID ${id}`, req.ip);

    return successResponse(res, 'Department updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM departments WHERE id = ?', [id]);
    
    await logActivity(req.user.id, 'Delete Department', 'Department Management', `Deleted department ID ${id}`, req.ip);

    return successResponse(res, 'Department deleted successfully');
  } catch (error) {
    next(error);
  }
};
