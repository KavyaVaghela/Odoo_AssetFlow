const db = require('../config/db');

class SettingsRepository {
  /**
   * Get settings (always ID = 1)
   */
  async get() {
    const sql = `SELECT * FROM settings WHERE id = 1`;
    const [rows] = await db.query(sql);
    
    if (rows.length === 0) {
      // Seed default settings row if missing
      const insertSql = `
        INSERT INTO settings (id, organization_name, organization_email, organization_phone, organization_logo, timezone, language, theme)
        VALUES (1, 'AssetFlow', 'admin@assetflow.com', '+18005550199', NULL, 'UTC', 'en', 'light')
      `;
      await db.query(insertSql);
      const [newRows] = await db.query(sql);
      return newRows[0];
    }
    
    return rows[0];
  }

  /**
   * Update organization settings (always ID = 1)
   */
  async update(data) {
    // Ensure settings record exists first
    await this.get();

    const sql = `
      UPDATE settings 
      SET organization_name = ?, organization_email = ?, organization_phone = ?, 
          organization_logo = COALESCE(?, organization_logo), timezone = ?, language = ?, theme = ?
      WHERE id = 1
    `;
    const params = [
      data.organization_name,
      data.organization_email,
      data.organization_phone || null,
      data.organization_logo || null,
      data.timezone || 'UTC',
      data.language || 'en',
      data.theme || 'light'
    ];
    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
  }
}

module.exports = new SettingsRepository();
