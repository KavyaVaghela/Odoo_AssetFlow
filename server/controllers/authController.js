import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { 
  sendRegistrationEmail, 
  sendOtpEmail, 
  sendPasswordResetSuccessEmail 
} from '../services/emailService.js';

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

      // 2. Validate pending approval state
      if (user.status === 'Pending') {
        return errorResponse(res, 'Waiting for Admin Approval', [
          { 
            message: 'Your registration is currently pending admin review.',
            status: 'Pending',
            approval_status: 'Pending',
            registration_date: user.created_at 
          }
        ], 403);
      }

      // 3. Validate rejection state
      if (user.status === 'Inactive' && user.approval_status === 'Rejected') {
        return errorResponse(res, 'Registration Rejected', [
          {
            message: 'Your account registration request has been declined by an administrator.',
            status: 'Inactive',
            approval_status: 'Rejected'
          }
        ], 403);
      }

      // 4. Validate other deactivated state
      if (user.status !== 'Active') {
        return errorResponse(res, 'Your account is deactivated. Contact the administrator.', [], 403);
      }

      // 5. Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return errorResponse(res, 'Invalid email or password', [], 401);
      }

      // 6. Fetch roles
      const [roleRows] = await pool.query(
        `SELECT r.role_name 
         FROM roles r 
         JOIN user_roles ur ON ur.role_id = r.id 
         WHERE ur.user_id = ?`,
        [user.id]
      );
      const roles = roleRows.map(r => r.role_name);

      // 7. Fetch department & designation names
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
        approval_status: user.approval_status,
        profile_image: user.profile_image,
        department_name: details.department_name || null,
        designation_name: details.designation_name || null,
        roles
      };

      // 8. Generate JWT access and refresh tokens
      const jwtSecret = process.env.JWT_SECRET || 'assetflow_secret_key_2026';
      
      const accessToken = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          employee_code: user.employee_code,
          role: roles[0] || 'Employee',
          roles
        },
        jwtSecret,
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        jwtSecret,
        { expiresIn: '7d' }
      );

      // Store refresh token in database
      await pool.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

      // Audit logs
      await pool.query(
        "INSERT INTO activity_logs (user_id, module, action, description) VALUES (?, 'Auth', 'Login', ?)",
        [user.id, `User ${user.first_name} ${user.last_name} logged in successfully.`]
      );

      return successResponse(res, 'Authentication successful', {
        accessToken,
        refreshToken,
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
      const { first_name, last_name, email, password, phone, department_id, designation_id, profile_image } = req.body;

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

      // 4. Create user record under 'Active' and 'Approved' status for testing
      const [insertRes] = await pool.query(
        `INSERT INTO users (employee_code, first_name, last_name, email, password_hash, phone, department_id, designation_id, profile_image, status, approval_status, joining_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', 'Approved', CURDATE())`,
        [employeeCode, first_name, last_name, email, passwordHash, phone || null, department_id || null, designation_id || null, profile_image || null]
      );
      const newUserId = insertRes.insertId;

      // 5. Assign default "Employee" role (role_id = 2)
      await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, 2)', [newUserId]);

      // 6. Create admin system notification
      const [adminUsers] = await pool.query(
        `SELECT u.id FROM users u JOIN user_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id WHERE r.role_name = 'Admin'`
      );
      if (adminUsers.length > 0) {
        const notificationValues = adminUsers.map(admin => [admin.id, 'New Registration Pending', `Employee ${first_name} ${last_name} (${employeeCode}) registered and is awaiting admin activation.`, 'System']);
        await pool.query(
          `INSERT INTO notifications (user_id, title, message, type) VALUES ?`,
          [notificationValues]
        );
      }

      // 7. Send registration received email
      await sendRegistrationEmail(email, `${first_name} ${last_name}`);

      return successResponse(res, 'Registration request submitted successfully.', {
        employee_code: employeeCode,
        status: 'Pending',
        approval_status: 'Pending'
      }, 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/auth/refresh
   */
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return errorResponse(res, 'Refresh token is required', [], 400);
      }

      const jwtSecret = process.env.JWT_SECRET || 'assetflow_secret_key_2026';
      
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, jwtSecret);
      } catch (err) {
        return errorResponse(res, 'Invalid or expired refresh token', [], 401);
      }

      // Fetch user and check active status
      const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
      if (userRows.length === 0) {
        return errorResponse(res, 'User not found', [], 404);
      }
      const user = userRows[0];

      if (user.status !== 'Active') {
        return errorResponse(res, 'User account is no longer active', [], 403);
      }

      if (user.refresh_token !== refreshToken) {
        return errorResponse(res, 'Invalid refresh token mapping', [], 401);
      }

      // Fetch roles
      const [roleRows] = await pool.query(
        `SELECT r.role_name 
         FROM roles r 
         JOIN user_roles ur ON ur.role_id = r.id 
         WHERE ur.user_id = ?`,
        [user.id]
      );
      const roles = roleRows.map(r => r.role_name);

      const newAccessToken = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          employee_code: user.employee_code,
          role: roles[0] || 'Employee',
          roles
        },
        jwtSecret,
        { expiresIn: '1h' }
      );

      const newRefreshToken = jwt.sign(
        { id: user.id },
        jwtSecret,
        { expiresIn: '7d' }
      );

      // Rotate token in DB
      await pool.query('UPDATE users SET refresh_token = ? WHERE id = ?', [newRefreshToken, user.id]);

      return successResponse(res, 'Token refreshed successfully', {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return errorResponse(res, 'Email is required', [], 400);
      }

      const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (userRows.length === 0) {
        return errorResponse(res, 'User with this email does not exist', [], 404);
      }
      const user = userRows[0];

      // Generate 6-digit verification OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      // Save in DB
      await pool.query(
        'UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?',
        [otp, expiresAt, user.id]
      );

      // Dispath OTP email
      await sendOtpEmail(email, `${user.first_name} ${user.last_name}`, otp);

      return successResponse(res, 'OTP verification code sent to your email.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/auth/verify-otp
   */
  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return errorResponse(res, 'Email and OTP code are required', [], 400);
      }

      const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (userRows.length === 0) {
        return errorResponse(res, 'User not found', [], 404);
      }
      const user = userRows[0];

      if (!user.otp_code || user.otp_code !== otp) {
        return errorResponse(res, 'Invalid OTP code', [], 400);
      }

      if (new Date(user.otp_expires_at) < new Date()) {
        return errorResponse(res, 'OTP code has expired', [], 400);
      }

      return successResponse(res, 'OTP code verified successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { email, otp, password } = req.body;
      if (!email || !otp || !password) {
        return errorResponse(res, 'Email, OTP, and new password are required', [], 400);
      }

      const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (userRows.length === 0) {
        return errorResponse(res, 'User not found', [], 404);
      }
      const user = userRows[0];

      // Validate OTP
      if (!user.otp_code || user.otp_code !== otp || new Date(user.otp_expires_at) < new Date()) {
        return errorResponse(res, 'OTP verification failed or expired.', [], 400);
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Save and clear OTP
      await pool.query(
        'UPDATE users SET password_hash = ?, otp_code = NULL, otp_expires_at = NULL WHERE id = ?',
        [passwordHash, user.id]
      );

      // Alert email
      await sendPasswordResetSuccessEmail(email, `${user.first_name} ${user.last_name}`);

      return successResponse(res, 'Password reset successful. You can now login with your new password.');
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
