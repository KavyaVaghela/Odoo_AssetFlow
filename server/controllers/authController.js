import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';

class AuthController {
  /**
   * POST /api/admin/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return errorResponse(res, 'Email and password are required', [], 400);
      }

      // 1. Fetch user
      const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (userRows.length === 0) {
        return errorResponse(res, 'Invalid email or password', [], 401);
      }
      const user = userRows[0];

      // 2. Validate user status
      if (user.status !== 'Active') {
        return errorResponse(res, 'Your account is deactivated. Contact the administrator.', [], 403);
      }

      // 3. Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return errorResponse(res, 'Invalid email or password', [], 401);
      }

      // 4. Fetch roles
      const [roleRows] = await pool.query(
        `SELECT r.role_name 
         FROM roles r 
         JOIN user_roles ur ON ur.role_id = r.id 
         WHERE ur.user_id = ?`,
        [user.id]
      );
      const roles = roleRows.map(r => r.role_name);

      // 5. Fetch department & designation names
      const [detailsRows] = await pool.query(
        `SELECT d.department_name, ds.designation_name 
         FROM users u 
         LEFT JOIN departments d ON u.department_id = d.id 
         LEFT JOIN designations ds ON u.designation_id = ds.id 
         WHERE u.id = ?`,
        [user.id]
      );
      const details = detailsRows[0] || {};

      const userPayload = {
        id: user.id,
        employee_code: user.employee_code,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        joining_date: user.joining_date,
        status: user.status,
        profile_image: user.profile_image,
        department_name: details.department_name || null,
        designation_name: details.designation_name || null,
        roles
      };

      // 6. Generate JWT token (role check in authMiddleware checks req.user.role)
      const jwtSecret = process.env.JWT_SECRET || 'assetflow_secret_key_2026';
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          employee_code: user.employee_code,
          role: roles[0] || 'Employee',
          roles
        },
        jwtSecret,
        { expiresIn: '24h' }
      );

      return successResponse(res, 'Authentication successful', {
        token,
        user: userPayload
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/auth/register
   */
  async register(req, res, next) {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return errorResponse(res, 'Missing required fields: first_name, last_name, email, and password are required.', [], 400);
      }

      // 1. Email check
      const [existingEmail] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existingEmail.length > 0) {
        return errorResponse(res, 'Email is already registered', [], 409);
      }

      // 2. Generate unique employee code
      const employeeCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

      // 3. Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 4. Default department / designation resolver
      let departmentId = null;
      let designationId = null;

      const [depts] = await pool.query("SELECT id FROM departments WHERE status = 'Active' LIMIT 1");
      if (depts.length > 0) {
        departmentId = depts[0].id;
        const [desigs] = await pool.query('SELECT id FROM designations WHERE department_id = ? LIMIT 1', [departmentId]);
        if (desigs.length > 0) {
          designationId = desigs[0].id;
        }
      }

      // 5. Create user
      const [insertRes] = await pool.query(
        `INSERT INTO users (employee_code, first_name, last_name, email, password_hash, department_id, designation_id, joining_date, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), 'Active')`,
        [employeeCode, first_name, last_name, email, passwordHash, departmentId, designationId]
      );
      const newUserId = insertRes.insertId;

      // 6. Assign role Employee (role_id = 2)
      await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, 2)', [newUserId]);

      // 7. Get details
      const [detailsRows] = await pool.query(
        `SELECT u.id, u.employee_code, u.first_name, u.last_name, u.email, u.phone, u.joining_date, u.status, u.profile_image,
                d.department_name, ds.designation_name
         FROM users u
         LEFT JOIN departments d ON u.department_id = d.id
         LEFT JOIN designations ds ON u.designation_id = ds.id
         WHERE u.id = ?`,
        [newUserId]
      );
      const user = detailsRows[0];
      const roles = ['Employee'];

      const userPayload = {
        ...user,
        roles
      };

      // 8. Generate JWT
      const jwtSecret = process.env.JWT_SECRET || 'assetflow_secret_key_2026';
      const token = jwt.sign(
        { 
          id: newUserId, 
          email: user.email, 
          employee_code: user.employee_code,
          role: 'Employee',
          roles
        },
        jwtSecret,
        { expiresIn: '24h' }
      );

      return successResponse(res, 'Account created successfully', {
        token,
        user: userPayload
      }, 201);
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
