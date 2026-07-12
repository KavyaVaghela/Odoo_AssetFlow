const settingsService = require('../services/settingsService');
const response = require('../utils/response');

class SettingsController {
  async getSettings(req, res, next) {
    try {
      const settings = await settingsService.getSettings();
      return response.success(res, 'System settings retrieved successfully', settings);
    } catch (err) {
      next(err);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const data = req.body;
      if (!data.organization_name || !data.organization_email) {
        return response.error(res, 'organization_name and organization_email are required', 400);
      }

      const settings = await settingsService.updateSettings(data);
      return response.success(res, 'System settings updated successfully', settings);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SettingsController();
