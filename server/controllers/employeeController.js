import pool from '../config/database.js';
import bcrypt from 'bcrypt';
import { successResponse, errorResponse } from '../utils/response.js';
import { sendApprovalEmail, sendRejectionEmail } from '../services/emailService.js';
import { logActivity } from '../services/activityLogService.js';
import { createNotification } from '../services/notificationService.js';

export const getEmployees = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    return successResponse(res, 'Employees fetched successfully', rows);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return errorResponse(res, 'Employee not found', [], 404);
    return successResponse(res, 'Employee fetched successfully', rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone, department_id, employee_code } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (first_name, last_name, email, password_hash, phone, department_id, employee_code, status, approval_status, joining_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', 'Approved', CURDATE())
    `;
    const [result] = await pool.query(query, [first_name, last_name, email, hashedPassword, phone, department_id, employee_code]);
    
    await logActivity(req.user.id, 'Create Employee', 'Employee Management', `Created employee ${email}`, req.ip);
    
    return successResponse(res, 'Employee created successfully', { id: result.insertId }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, department_id } = req.body;
    const query = 'UPDATE users SET first_name = ?, last_name = ?, phone = ?, department_id = ? WHERE id = ?';
    await pool.query(query, [first_name, last_name, phone, department_id, id]);
    
    await logActivity(req.user.id, 'Update Employee', 'Employee Management', `Updated employee ID ${id}`, req.ip);
    
    return successResponse(res, 'Employee updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    
    await logActivity(req.user.id, 'Delete Employee', 'Employee Management', `Deleted employee ID ${id}`, req.ip);
    
    return successResponse(res, 'Employee deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const approveEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) return errorResponse(res, 'Employee not found', [], 404);
    
    await pool.query('UPDATE users SET status = "Active", approval_status = "Approved" WHERE id = ?', [id]);
    
    await sendApprovalEmail(users[0].email, users[0].first_name);
    await logActivity(req.user.id, 'Approve Employee', 'Employee Management', `Approved employee ID ${id}`, req.ip);
    await createNotification(id, 'Employee Approved', 'Your account has been approved.');
    
    return successResponse(res, 'Employee approved successfully');
  } catch (error) {
    next(error);
  }
};

export const rejectEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) return errorResponse(res, 'Employee not found', [], 404);
    
    await pool.query('UPDATE users SET status = "Rejected", approval_status = "Rejected" WHERE id = ?', [id]);
    
    await sendRejectionEmail(users[0].email, users[0].first_name);
    await logActivity(req.user.id, 'Reject Employee', 'Employee Management', `Rejected employee ID ${id}`, req.ip);
    await createNotification(id, 'Employee Rejected', 'Your account registration was rejected.');
    
    return successResponse(res, 'Employee rejected successfully');
  } catch (error) {
    next(error);
  }
};

export const activateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE users SET status = "Active" WHERE id = ?', [id]);
    return successResponse(res, 'Employee activated successfully');
  } catch (error) {
    next(error);
  }
};

export const deactivateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE users SET status = "Inactive" WHERE id = ?', [id]);
    return successResponse(res, 'Employee deactivated successfully');
  } catch (error) {
    next(error);
  }
};

export const getPendingUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE approval_status = "Pending"');
    return successResponse(res, 'Pending employees fetched successfully', rows);
  } catch (error) {
    next(error);
  }
};
