const userRepository = require('../repositories/userRepository');
const roleRepository = require('../repositories/roleRepository');
const departmentRepository = require('../repositories/departmentRepository');
const designationRepository = require('../repositories/designationRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('../utils/response');

class AuthController {
  /**
   * POST /api/admin/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return response.error(res, 'Email and password are required', 400);
      }

      // 1. Fetch user by email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return response.error(res, 'Invalid email or password', 401);
      }

      // 2. Validate user status
      if (user.status !== 'Active') {
        return response.error(res, 'Your account is deactivated. Contact the administrator.', 403);
      }

      // 3. Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return response.error(res, 'Invalid email or password', 401);
      }

      // 4. Fetch user complete details (including roles and departments)
      const userDetails = await userRepository.findById(user.id);
      
      // Remove password hash from payload
      delete userDetails.password_hash;

      // 5. Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'assetflow_secret_key_2026';
      const token = jwt.sign(
        { 
          id: userDetails.id, 
          email: userDetails.email, 
          employee_code: userDetails.employee_code,
          roles: userDetails.roles.map(r => r.role_name)
        },
        jwtSecret,
        { expiresIn: '24h' }
      );

      return response.success(res, 'Authentication successful', {
        token,
        user: userDetails
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/auth/register (signup)
   */
  async register(req, res, next) {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return response.error(res, 'Missing required fields: first_name, last_name, email, and password are required.', 400);
      }

      // 1. Email uniqueness check
      const existingEmail = await userRepository.findByEmail(email);
      if (existingEmail) {
        return response.error(res, 'Email is already registered', 409);
      }

      // 2. Auto-generate employee code (e.g. EMP-9382)
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const employeeCode = `EMP-${randomCode}`;

      // 3. Verify code uniqueness (just in case)
      const existingCode = await userRepository.findByEmployeeCode(employeeCode);
      if (existingCode) {
        // Retry with another code
        const retryCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
        req.body.employee_code = retryCode;
      } else {
        req.body.employee_code = employeeCode;
      }

      // 4. Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 5. Default associations
      // Set to NULL or first available department/designation for new signups
      let departmentId = null;
      let designationId = null;

      // Select first active department/designation if available in DB
      const depts = await departmentRepository.findAll();
      const activeDept = depts.find(d => d.status === 'Active');
      if (activeDept) {
        departmentId = activeDept.id;
        const desigs = await designationRepository.findAll(activeDept.id);
        if (desigs.length > 0) {
          designationId = desigs[0].id;
        }
      }

      // 6. Write user record
      const newUserId = await userRepository.create({
        employee_code: req.body.employee_code,
        first_name,
        last_name,
        email,
        phone: req.body.phone || null,
        password_hash: passwordHash,
        profile_image: null,
        department_id: departmentId,
        designation_id: designationId,
        joining_date: new Date().toISOString().slice(0, 10), // today's date
        status: 'Active'
      });

      // 7. Map to default "Employee" role (role_id = 2)
      await userRepository.assignRole(newUserId, 2); // Employee role ID is 2

      // 8. Fetch complete details of newly created user
      const userDetails = await userRepository.findById(newUserId);
      delete userDetails.password_hash;

      // 9. Generate JWT Token
      const jwtSecret = process.env.JWT_SECRET || 'assetflow_secret_key_2026';
      const token = jwt.sign(
        { 
          id: userDetails.id, 
          email: userDetails.email, 
          employee_code: userDetails.employee_code,
          roles: userDetails.roles.map(r => r.role_name)
        },
        jwtSecret,
        { expiresIn: '24h' }
      );

      return response.success(res, 'Account created successfully', {
        token,
        user: userDetails
      }, 201);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
