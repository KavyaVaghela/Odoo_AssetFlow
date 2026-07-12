import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

export const protect = (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, no token provided', [], 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error.message);
    return errorResponse(res, 'Not authorized, token failed or expired', [], 401);
  }
};

// Role-based authorization middleware
// Usage: router.get('/admin-only', protect, authorizeRoles('Admin'), controllerFunc)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden: You do not have permission to access this resource', [], 403);
    }
    next();
  };
};
