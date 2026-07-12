const db = require('../config/db');

class DesignationRepository {
  /**
   * Find designations, optionally filtering by department
   */
  async findAll(departmentId = null) {
    let sql = `
      SELECT ds.id, ds.designation_name, ds.department_id, ds.description, ds.created_at,
             d.department_name, d.department_code
      FROM designations ds
      INNER JOIN departments d ON ds.department_id = d.id
    `;
    const params = [];

    if (departmentId) {
      sql += ` WHERE ds.department_id = ?`;
      params.push(parseInt(departmentId, 10));
    }

    sql += ` ORDER BY ds.designation_name ASC`;
    const [rows] = await db.query(sql, params);
    return rows;
  }

  /**
   * Find designation by ID
   */
  async findById(id) {
    const sql = `
      SELECT ds.id, ds.designation_name, ds.department_id, ds.description, ds.created_at,
             d.department_name, d.department_code
      FROM designations ds
      INNER JOIN departments d ON ds.department_id = d.id
      WHERE ds.id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Create new designation
   */
  async create(data) {
    const sql = `
      INSERT INTO designations (designation_name, department_id, description)
      VALUES (?, ?, ?)
    `;
    const params = [
      data.designation_name,
      data.department_id,
      data.description || null
    ];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  /**
   * Update designation
   */
  async update(id, data) {
    const sql = `
      UPDATE designations 
      SET designation_name = ?, department_id = ?, description = ?
      WHERE id = ?
    `;
    const params = [
      data.designation_name,
      data.department_id,
      data.description || null,
      id
    ];
    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
  }

  /**
   * Delete designation
   */
  async delete(id) {
    const sql = `DELETE FROM designations WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Check if any active users hold this designation
   */
  async hasEmployees(designationId) {
    const sql = `SELECT COUNT(*) AS count FROM users WHERE designation_id = ?`;
    const [rows] = await db.query(sql, [designationId]);
    return rows[0].count > 0;
  }
}

module.exports = new DesignationRepository();
