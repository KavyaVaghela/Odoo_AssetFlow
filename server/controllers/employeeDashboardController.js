import pool from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import bcrypt from 'bcrypt';
import { logActivity } from '../services/activityLogService.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch basic employee details
    const [userRows] = await pool.query(
      `SELECT u.first_name, u.last_name, u.email, d.department_name, ds.designation_name 
       FROM users u 
       LEFT JOIN departments d ON u.department_id = d.id 
       LEFT JOIN designations ds ON u.designation_id = ds.id 
       WHERE u.id = ?`,
      [userId]
    );
    const employeeInfo = userRows[0];

    // Fetch counts for dashboard
    const [assetCount] = await pool.query(
      `SELECT COUNT(*) as count FROM asset_allocations WHERE employee_id = ? AND allocation_status = 'Active'`,
      [userId]
    );

    const [bookingCount] = await pool.query(
      `SELECT COUNT(*) as count FROM resource_bookings WHERE employee_id = ? AND status IN ('Pending', 'Approved')`,
      [userId]
    );

    const [pendingRequestsCount] = await pool.query(
      `SELECT COUNT(*) as count FROM employee_requests WHERE employee_id = ? AND status = 'Pending'`,
      [userId]
    );

    const [maintenanceCount] = await pool.query(
      `SELECT COUNT(*) as count FROM maintenance_requests WHERE employee_id = ? AND status NOT IN ('Completed', 'Rejected')`,
      [userId]
    );

    const [unreadNotifCount] = await pool.query(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0`,
      [userId]
    );

    // Fetch recent activities
    const [recentActivities] = await pool.query(
      `SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`,
      [userId]
    );

    return successResponse(res, 'Dashboard summary retrieved successfully', {
      employee: employeeInfo,
      assignedAssets: assetCount[0].count,
      activeBookings: bookingCount[0].count,
      pendingRequests: pendingRequestsCount[0].count,
      maintenanceRequests: maintenanceCount[0].count,
      unreadNotifications: unreadNotifCount[0].count,
      recentActivities
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const [userRows] = await pool.query(
      `SELECT u.id, u.employee_code, u.first_name, u.last_name, u.email, u.phone, u.profile_image, u.joining_date, d.department_name, ds.designation_name 
       FROM users u 
       LEFT JOIN departments d ON u.department_id = d.id 
       LEFT JOIN designations ds ON u.designation_id = ds.id 
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (userRows.length === 0) {
      return errorResponse(res, 'User not found', [], 404);
    }

    return successResponse(res, 'Profile retrieved successfully', userRows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    let profile_image = null;

    if (req.file) {
      profile_image = `/uploads/${req.file.filename}`;
    }

    let query = 'UPDATE users SET updated_at = NOW()';
    let params = [];

    if (phone) {
      query += ', phone = ?';
      params.push(phone);
    }

    if (profile_image) {
      query += ', profile_image = ?';
      params.push(profile_image);
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      query += ', password_hash = ?';
      params.push(passwordHash);
    }

    query += ' WHERE id = ?';
    params.push(req.user.id);

    await pool.query(query, params);

    await logActivity(req.user.id, 'Profile', 'Update Profile', 'Updated personal profile details.', req.ip);

    return successResponse(res, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
