const db = require('../config/db');

class ActivityLogRepository {
  /**
   * Log an audit trail activity
   */
  async create({ userId, module, action, description, ipAddress }) {
    const sql = `
      INSERT INTO activity_logs (user_id, module, action, description, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      userId || null,
      module,
      action,
      description,
      ipAddress || null
    ];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  /**
   * Get all activity logs with user names
   */
  async findAll({ limit = 50, offset = 0 }) {
    const sql = `
      SELECT al.id, al.module, al.action, al.description, al.ip_address, al.created_at,
             al.user_id,
             CONCAT(u.first_name, ' ', u.last_name) AS user_name,
             u.email AS user_email
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const countSql = `SELECT COUNT(*) AS total FROM activity_logs`;
    
    const [countRows] = await db.query(countSql);
    const total = countRows[0].total;

    const [rows] = await db.query(sql, [parseInt(limit, 10), parseInt(offset, 10)]);
    return { rows, total };
  }
}

module.exports = new ActivityLogRepository();
