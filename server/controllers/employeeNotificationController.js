import pool from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const [notifications] = await pool.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    return successResponse(res, 'Notifications retrieved successfully', notifications);
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [existing] = await pool.query('SELECT id FROM notifications WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (existing.length === 0) {
      return errorResponse(res, 'Notification not found or unauthorized', [], 404);
    }

    await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    
    return successResponse(res, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};
