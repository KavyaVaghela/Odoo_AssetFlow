import pool from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getActivityLogs = async (req, res, next) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    // Fetch logs with user details
    const query = `
      SELECT al.*, u.first_name, u.last_name, u.email 
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(query, [parsedLimit, offset]);

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM activity_logs');
    const total = countResult[0].total;

    return successResponse(res, 'Activity logs retrieved successfully', {
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
};
