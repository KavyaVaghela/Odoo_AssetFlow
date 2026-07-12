import pool from '../config/database.js';

/**
 * Automatically create notifications.
 * @param {number} userId - The ID of the user receiving the notification (or 0 for admin broadcast).
 * @param {string} type - Event type (e.g., 'Employee Registered', 'Role Assigned').
 * @param {string} message - Notification text.
 */
export const createNotification = async (userId, type, message) => {
  try {
    const query = `
      INSERT INTO notifications (user_id, type, message, created_at) 
      VALUES (?, ?, ?, NOW())
    `;
    // We assume the table `notifications` is available.
    await pool.query(query, [userId, type, message]);
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};
