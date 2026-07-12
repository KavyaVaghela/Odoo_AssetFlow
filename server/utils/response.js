/**
 * Standardized API Response format helper functions
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {string} message - Response message
 * @param {any} data - Response payload data
 * @param {number} statusCode - HTTP status code (default 200)
 */
exports.success = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error description message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {any} errors - Additional validation or stack errors
 */
exports.error = (res, message, statusCode = 500, errors = null) => {
  const responsePayload = {
    success: false,
    message
  };

  if (errors) {
    responsePayload.errors = errors;
  }

  return res.status(statusCode).json(responsePayload);
};
