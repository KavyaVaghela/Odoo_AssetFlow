import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { errorResponse } from '../utils/response.js';

/**
 * Middleware to authenticate and authorize a Department Head (HOD)
 */
const verifyHOD = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No token provided.', [], 401);
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'assetflow_secret_key_2026';
    
    // Decode token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return errorResponse(res, 'Invalid or expired token.', [], 401);
    }

    req.user = decoded;

    // Fetch HOD's department context from DB
    const sql = `
      SELECT id, department_name 
      FROM departments 
      WHERE department_head = ? AND status = 'Active'
    `;
    const [depts] = await pool.query(sql, [decoded.id]);

    if (depts.length === 0) {
      return errorResponse(res, 'Access denied. You are not authorized as an active Department Head.', [], 403);
    }

    // Attach HOD department attributes to the request context
    req.user.hodDepartmentId = depts[0].id;
    req.user.hodDepartmentName = depts[0].department_name;

    next();
  } catch (err) {
    next(err);
  }
};

export default verifyHOD;
