const activityLogService = require('../services/activityLogService');

/**
 * Audit Logger Middleware
 * Intercepts successful write/mutation requests (POST, PUT, DELETE) 
 * and logs them to the activity_logs table.
 */
module.exports = (req, res, next) => {
  const originalJson = res.json;

  // Intercept the json response function to log after a successful response is sent
  res.json = function (data) {
    res.json = originalJson; // Restore the original function
    const result = res.json(data);

    // Only log successful write operations (mutations)
    if (
      res.statusCode >= 200 && 
      res.statusCode < 300 && 
      ['POST', 'PUT', 'DELETE'].includes(req.method)
    ) {
      // Exclude logs fetch itself to avoid loops
      if (req.originalUrl.includes('/activity-logs')) {
        return result;
      }

      // Determine module, action, and description from path
      const pathParts = req.originalUrl.split('?')[0].split('/').filter(Boolean);
      const resource = pathParts[pathParts.length - 1] || 'resource';
      
      const moduleName = 'Admin';
      const actionName = `${req.method}_${resource.replace(/-\d+/g, '').toUpperCase()}`;
      
      // Extract performing user (for demo/REST testing, we can supply this via headers or query)
      const userId = req.headers['x-user-id'] || req.query.user_id || null;
      
      let description = `${req.method} operation performed on ${req.originalUrl}`;
      if (data && data.message) {
        description = data.message;
      }

      // Async log insertion without blocking the client response
      activityLogService.logActivity({
        userId: userId ? parseInt(userId, 10) : null,
        module: moduleName,
        action: actionName,
        description: description,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
      }).catch(err => {
        console.error('⚠️ Failed to write audit activity log:', err.message);
      });
    }

    return result;
  };

  next();
};
