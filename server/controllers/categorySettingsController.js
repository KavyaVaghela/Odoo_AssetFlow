import pool from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { logActivity } from '../services/activityLogService.js';
import { createNotification } from '../services/notificationService.js';

// --- Asset Categories ---

export const getCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM asset_categories');
    return successResponse(res, 'Asset categories fetched successfully', rows);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { category_name, category_code, description, icon } = req.body;
    const [result] = await pool.query(
      'INSERT INTO asset_categories (category_name, category_code, description, icon, status) VALUES (?, ?, ?, ?, "Active")', 
      [category_name, category_code, description, icon]
    );
    
    return successResponse(res, 'Asset category created successfully', { id: result.insertId }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_name, category_code, description, icon, status } = req.body;
    await pool.query(
      'UPDATE asset_categories SET category_name = ?, category_code = ?, description = ?, icon = ?, status = ? WHERE id = ?', 
      [category_name, category_code, description, icon, status || 'Active', id]
    );
    
    return successResponse(res, 'Asset category updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM asset_categories WHERE id = ?', [id]);
    return successResponse(res, 'Asset category deleted successfully');
  } catch (error) {
    next(error);
  }
};

// --- Settings ---

export const getSettings = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings');
    // Assuming settings table holds key-value pairs or a single row of config
    return successResponse(res, 'Settings fetched successfully', rows);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { theme, organization_name, organization_email, organization_phone, timezone, language } = req.body;
    const query = 'UPDATE settings SET theme = ?, organization_name = ?, organization_email = ?, organization_phone = ?, timezone = ?, language = ? WHERE id = 1';
    await pool.query(query, [theme, organization_name, organization_email, organization_phone, timezone, language]);
    
    await logActivity(req.user.id, 'Update Settings', 'Settings Management', 'Updated global settings', req.ip);

    return successResponse(res, 'Settings updated successfully');
  } catch (error) {
    next(error);
  }
};

export const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'Please upload a file', [], 400);
    }
    
    const logoUrl = `/uploads/${req.file.filename}`;
    await pool.query('UPDATE settings SET organization_logo = ? WHERE id = 1', [logoUrl]);
    
    await logActivity(req.user.id, 'Upload Logo', 'Settings Management', 'Uploaded new organization logo', req.ip);

    return successResponse(res, 'Organization logo uploaded successfully', { logoUrl });
  } catch (error) {
    next(error);
  }
};
