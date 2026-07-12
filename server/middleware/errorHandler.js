const response = require('../utils/response');

/**
 * Global Express Error Handling Middleware
 */
module.exports = (err, req, res, next) => {
  console.error('🚨 Error caught by middleware:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred on the server';

  // Handle specific MySQL constraint errors gracefully
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return response.error(
      res, 
      'Database Restriction: This record cannot be deleted because it is currently referenced by other records.', 
      409
    );
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return response.error(
      res, 
      'Database Restriction: Duplicate entry. A record with these details already exists.', 
      409
    );
  }

  // General error response
  return response.error(
    res, 
    message, 
    statusCode, 
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};
