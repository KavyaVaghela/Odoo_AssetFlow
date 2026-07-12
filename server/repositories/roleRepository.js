const db = require('../config/db');

class RoleRepository {
  /**
   * Find all roles
   */
  async findAll() {
    const sql = `SELECT * FROM roles ORDER BY role_name ASC`;
    const [rows] = await db.query(sql);
    return rows;
  }

  /**
   * Find a role by ID
   */
  async findById(id) {
    const sql = `SELECT * FROM roles WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find all permissions in the system
   */
  async findAllPermissions() {
    const sql = `SELECT * FROM permissions ORDER BY module_name ASC, permission_name ASC`;
    const [rows] = await db.query(sql);
    return rows;
  }

  /**
   * Find permissions assigned to a specific role
   */
  async findPermissionsByRoleId(roleId) {
    const sql = `
      SELECT p.id, p.permission_name, p.module_name, p.description
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `;
    const [rows] = await db.query(sql, [roleId]);
    return rows;
  }

  /**
   * Check if a role is assigned to any active user
   */
  async hasUsers(roleId) {
    const sql = `SELECT COUNT(*) AS count FROM user_roles WHERE role_id = ? AND status = 'Active'`;
    const [rows] = await db.query(sql, [roleId]);
    return rows[0].count > 0;
  }

  /**
   * Update role permissions mapping (atomic sync transaction)
   */
  async updateRolePermissions(roleId, permissionIds) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Delete existing associations
      await connection.query(`DELETE FROM role_permissions WHERE role_id = ?`, [roleId]);

      // 2. Insert new associations
      if (permissionIds && permissionIds.length > 0) {
        const insertSql = `INSERT INTO role_permissions (role_id, permission_id) VALUES ?`;
        const values = permissionIds.map(permId => [roleId, permId]);
        await connection.query(insertSql, [values]);
      }

      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = new RoleRepository();
