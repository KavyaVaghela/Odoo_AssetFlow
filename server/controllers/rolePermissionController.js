import pool from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { logActivity } from '../services/activityLogService.js';
import { createNotification } from '../services/notificationService.js';

// --- Roles ---

export const getRoles = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles');
    return successResponse(res, 'Roles fetched successfully', rows);
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const { role_name, description } = req.body;
    const [result] = await pool.query('INSERT INTO roles (role_name, description) VALUES (?, ?)', [role_name, description]);
    
    return successResponse(res, 'Role created successfully', { id: result.insertId }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_name, description } = req.body;
    await pool.query('UPDATE roles SET role_name = ?, description = ? WHERE id = ?', [role_name, description, id]);
    
    return successResponse(res, 'Role updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM roles WHERE id = ?', [id]);
    return successResponse(res, 'Role deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const assignRoleToEmployee = async (req, res, next) => {
  try {
    const { user_id, role_id } = req.body;
    await pool.query('INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_date, status) VALUES (?, ?, ?, NOW(), "Active")', [user_id, role_id, req.user.id]);
    
    await logActivity(req.user.id, 'Role Assignment', 'Role Management', `Assigned role ${role_id} to user ${user_id}`, req.ip);
    await createNotification(user_id, 'Role Assigned', 'You have been assigned a new role.');

    return successResponse(res, 'Role assigned to employee successfully');
  } catch (error) {
    next(error);
  }
};

export const removeRoleFromEmployee = async (req, res, next) => {
  try {
    const { user_id, role_id } = req.body;
    await pool.query('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?', [user_id, role_id]);
    
    return successResponse(res, 'Role removed from employee successfully');
  } catch (error) {
    next(error);
  }
};

// --- Permissions ---

export const getPermissions = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM permissions');
    return successResponse(res, 'Permissions fetched successfully', rows);
  } catch (error) {
    next(error);
  }
};

export const createPermission = async (req, res, next) => {
  try {
    const { permission_name, module_name, description } = req.body;
    const [result] = await pool.query('INSERT INTO permissions (permission_name, module_name, description) VALUES (?, ?, ?)', [permission_name, module_name, description]);
    
    return successResponse(res, 'Permission created successfully', { id: result.insertId }, 201);
  } catch (error) {
    next(error);
  }
};

export const assignPermissionToRole = async (req, res, next) => {
  try {
    const { role_id, permission_id } = req.body;
    await pool.query('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [role_id, permission_id]);
    
    return successResponse(res, 'Permission assigned to role successfully');
  } catch (error) {
    next(error);
  }
};

export const removePermissionFromRole = async (req, res, next) => {
  try {
    const { role_id, permission_id } = req.body;
    await pool.query('DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?', [role_id, permission_id]);
    
    return successResponse(res, 'Permission removed from role successfully');
  } catch (error) {
    next(error);
  }
};
