const db = require('../config/db');

class DepartmentRepository {
  /**
   * Get all departments with employee counts and head information
   */
  async findAll() {
    const sql = `
      SELECT d.id, d.department_name, d.department_code, d.description, d.status, d.created_at,
             d.department_head,
             CONCAT(u.first_name, ' ', u.last_name) AS head_name,
             u.email AS head_email,
             COUNT(emp.id) AS employee_count
      FROM departments d
      LEFT JOIN users u ON d.department_head = u.id
      LEFT JOIN users emp ON d.id = emp.department_id
      GROUP BY d.id
      ORDER BY d.department_name ASC
    `;
    const [rows] = await db.query(sql);
    return rows;
  }

  /**
   * Find department by ID
   */
  async findById(id) {
    const sql = `
      SELECT d.id, d.department_name, d.department_code, d.description, d.status, d.department_head,
             CONCAT(u.first_name, ' ', u.last_name) AS head_name
      FROM departments d
      LEFT JOIN users u ON d.department_head = u.id
      WHERE d.id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find department by Code (for uniqueness checks)
   */
  async findByCode(departmentCode) {
    const sql = `SELECT * FROM departments WHERE department_code = ?`;
    const [rows] = await db.query(sql, [departmentCode]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Create a new department
   */
  async create(data) {
    const sql = `
      INSERT INTO departments (department_name, department_code, department_head, description, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      data.department_name,
      data.department_code,
      data.department_head || null,
      data.description || null,
      data.status || 'Active'
    ];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  /**
   * Update department
   */
  async update(id, data) {
    const sql = `
      UPDATE departments 
      SET department_name = ?, department_code = ?, department_head = ?, description = ?, status = ?
      WHERE id = ?
    `;
    const params = [
      data.department_name,
      data.department_code,
      data.department_head || null,
      data.description || null,
      data.status,
      id
    ];
    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
  }

  /**
   * Delete a department (ON DELETE RESTRICT will cause error if employees exist, handled in service)
   */
  async delete(id) {
    const sql = `DELETE FROM departments WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Check if department has any employees assigned
   */
  async hasEmployees(departmentId) {
    const sql = `SELECT COUNT(*) AS count FROM users WHERE department_id = ?`;
    const [rows] = await db.query(sql, [departmentId]);
    return rows[0].count > 0;
  }
}

module.exports = new DepartmentRepository();
