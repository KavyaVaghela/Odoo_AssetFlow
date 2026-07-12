import pool from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [employees] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [departments] = await pool.query('SELECT COUNT(*) as total FROM departments');
    const [categories] = await pool.query('SELECT COUNT(*) as total FROM asset_categories');
    const [pendingApprovals] = await pool.query('SELECT COUNT(*) as total FROM users WHERE status = "Pending"');
    
    const [recentActivities] = await pool.query('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 5');
    const [recentNotifications] = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5');

    return successResponse(res, 'Dashboard statistics fetched successfully', {
      totalEmployees: employees[0].total,
      totalDepartments: departments[0].total,
      totalAssetCategories: categories[0].total,
      pendingApprovals: pendingApprovals[0].total,
      recentActivities,
      recentNotifications,
    });
  } catch (error) {
    next(error);
  }
};
