import { errorResponse } from '../utils/response.js';

export const errorMiddleware = (err, req, res, next) => {
  console.error('[Error Middleware]: ', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Format errors array if it exists (e.g., from express-validator)
  const errors = err.errors || [];

  return errorResponse(res, message, errors, statusCode);
};
