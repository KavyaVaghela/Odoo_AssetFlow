const activityLogRepository = require('../repositories/activityLogRepository');

class ActivityLogService {
  async logActivity({ userId, module, action, description, ipAddress }) {
    return await activityLogRepository.create({
      userId,
      module,
      action,
      description,
      ipAddress
    });
  }

  async getActivityLogs({ limit = 50, offset = 0 }) {
    return await activityLogRepository.findAll({ limit, offset });
  }
}

module.exports = new ActivityLogService();
