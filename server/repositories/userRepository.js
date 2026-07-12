const db = require('../config/db');

class UserRepository {
  /**
   * Find users with optional filters and pagination
   */
  async findAll({ search, status, departmentId, limit = 10, offset = 0 }) {
    let sql = `
      SELECT u.id, u.employee_code, u.first_name, u.last_name, u.email, u.phone, 
             u.joining_date, u.status, u.profile_image, u.created_at,
             d.department_name, d.department_code,
             ds.designation_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN designations ds ON u.designation_id = ds.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.employee_code LIKE ?)`;
      const searchWildcard = `%${search}%`;
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    if (status) {
      sql += ` AND u.status = ?`;
      params.push(status);
    }

    if (departmentId) {
      sql += ` AND u.department_id = ?`;
      params.push(parseInt(departmentId, 10));
    }

    // Get total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) AS temp`;
    const [countRows] = await db.query(countSql, params);
    const total = countRows[0].total;

    sql += ` ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await db.query(sql, params);
    return { rows, total };
  }

  /**
   * Find user details by ID
   */
  async findById(id) {
    const sql = `
      SELECT u.id, u.employee_code, u.first_name, u.last_name, u.email, u.phone, 
             u.profile_image, u.joining_date, u.status, u.created_at, u.updated_at,
             u.department_id, u.designation_id,
             d.department_name, d.department_code,
             ds.designation_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN designations ds ON u.designation_id = ds.id
      WHERE u.id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    if (rows.length === 0) return null;

    const user = rows[0];

    // Fetch user's roles
    const rolesSql = `
      SELECT r.id, r.role_name, r.description 
      FROM roles r
      INNER JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ? AND ur.status = 'Active'
    `;
    const [roles] = await db.query(rolesSql, [id]);
    user.roles = roles;

    return user;
  }

  /**
   * Find user by Email (used for login or uniqueness checks)
   */
  async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await db.query(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find user by Employee Code (used for uniqueness checks)
   */
  async findByEmployeeCode(employeeCode) {
    const sql = `SELECT * FROM users WHERE employee_code = ?`;
    const [rows] = await db.query(sql, [employeeCode]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Create a new user
   */
  async create(userData) {
    const sql = `
      INSERT INTO users (employee_code, first_name, last_name, email, phone, 
                         password_hash, profile_image, department_id, designation_id, 
                         joining_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      userData.employee_code,
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.phone || null,
      userData.password_hash,
      userData.profile_image || null,
      userData.department_id || null,
      userData.designation_id || null,
      userData.joining_date,
      userData.status || 'Active'
    ];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  /**
   * Update an existing user
   */
  async update(id, userData) {
    const sql = `
      UPDATE users 
      SET first_name = ?, last_name = ?, email = ?, phone = ?, 
          profile_image = COALESCE(?, profile_image), department_id = ?, 
          designation_id = ?, joining_date = ?, status = ?
      WHERE id = ?
    `;
    const params = [
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.phone || null,
      userData.profile_image || null,
      userData.department_id || null,
      userData.designation_id || null,
      userData.joining_date,
      userData.status,
      id
    ];
    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
  }

  /**
   * Delete a user (restricted by FK constraints on departments/roles)
   */
  async delete(id) {
    const sql = `DELETE FROM users WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Assign a role to a user
   */
  async assignRole(userId, roleId, assignedBy = null) {
    const sql = `
      INSERT INTO user_roles (user_id, role_id, assigned_by, status)
      VALUES (?, ?, ?, 'Active')
      ON DUPLICATE KEY UPDATE status = 'Active'
    `;
    const [result] = await db.query(sql, [userId, roleId, assignedBy]);
    return result.affectedRows > 0;
  }

  /**
   * Revoke a role from a user
   */
  async revokeRole(userId, roleId) {
    const sql = `DELETE FROM user_roles WHERE user_id = ? AND role_id = ?`;
    const [result] = await db.query(sql, [userId, roleId]);
    return result.affectedRows > 0;
  }
}

module.exports = new UserRepository();
