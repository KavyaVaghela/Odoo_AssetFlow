const settingsRepository = require('../repositories/settingsRepository');

class SettingsService {
  async getSettings() {
    return await settingsRepository.get();
  }

  async updateSettings(data) {
    // Validate email format
    if (data.organization_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.organization_email)) {
        throw new Error('Invalid email format for organization email');
      }
    }

    const updated = await settingsRepository.update(data);
    if (!updated) {
      throw new Error('Failed to update system settings');
    }
    return await settingsRepository.get();
  }
}

module.exports = new SettingsService();
