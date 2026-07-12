import pool from '../config/database.js';

/**
 * Log an activity automatically.
 * @param {number} userId - The ID of the user performing the action.
 * @param {string} action - The action performed (e.g., 'Update Employee').
 * @param {string} module - The module affected (e.g., 'Employee Management').
 * @param {string} description - Detailed description.
 * @param {string} ipAddress - IP address of the user.
 */
export const logActivity = async (userId, action, module, description, ipAddress) => {
  try {
    const query = `
      INSERT INTO activity_logs (user_id, action, module, description, ip_address, timestamp) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    // We assume the table `activity_logs` is created as per the DB instructions (though not listed explicitly in the prompt's table list, the log section requires it).
    // The prompt specified "Automatically store User, Action, Module, Description, IP Address, Timestamp".
    await pool.query(query, [userId, action, module, description, ipAddress]);
  } catch (error) {
    console.error('Failed to insert activity log:', error.message);
  }
};
