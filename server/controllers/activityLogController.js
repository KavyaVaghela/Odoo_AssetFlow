const activityLogService = require('../services/activityLogService');
const response = require('../utils/response');

class ActivityLogController {
  async getActivityLogs(req, res, next) {
    try {
      const { limit = 50, page = 1 } = req.query;
      const parsedLimit = parseInt(limit, 10);
      const parsedPage = parseInt(page, 10);
      const offset = (parsedPage - 1) * parsedLimit;

      const { rows, total } = await activityLogService.getActivityLogs({
        limit: parsedLimit,
        offset
      });

      return response.success(res, 'Activity logs retrieved successfully', {
        logs: rows,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit)
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ActivityLogController();
