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
    const { name, description } = req.body;
    const [result] = await pool.query('INSERT INTO asset_categories (name, description) VALUES (?, ?)', [name, description]);
    
    await createNotification(0, 'Category Created', `New asset category ${name} was created.`);

    return successResponse(res, 'Asset category created successfully', { id: result.insertId }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await pool.query('UPDATE asset_categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    
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
    const { theme, organization_name, contact_email } = req.body;
    // We assume a simple key-value settings table where we update keys individually or a single settings row
    // For this example, assuming a single row of global settings for the organization
    const query = 'UPDATE settings SET theme = ?, organization_name = ?, contact_email = ? WHERE id = 1';
    await pool.query(query, [theme, organization_name, contact_email]);
    
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
    // Assuming a logo_url column in the settings table
    await pool.query('UPDATE settings SET logo_url = ? WHERE id = 1', [logoUrl]);
    
    await logActivity(req.user.id, 'Upload Logo', 'Settings Management', 'Uploaded new organization logo', req.ip);

    return successResponse(res, 'Organization logo uploaded successfully', { logoUrl });
  } catch (error) {
    next(error);
  }
};
