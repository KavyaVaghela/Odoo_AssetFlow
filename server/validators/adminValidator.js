import { body, param, validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return early with standardized error response
    return errorResponse(res, 'Validation failed', errors.array(), 400);
  }
  next();
};

export const employeeValidation = [
  body('first_name').notEmpty().withMessage('First name is required').trim(),
  body('last_name').notEmpty().withMessage('Last name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('department_id').optional().isInt().withMessage('Department ID must be an integer'),
  body('role_id').optional().isInt().withMessage('Role ID must be an integer'),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('employee_code').optional().isString().trim(),
];

export const departmentValidation = [
  body('name').notEmpty().withMessage('Department name is required').trim(),
  body('head_id').optional().isInt().withMessage('Department head ID must be an integer'),
];

export const roleValidation = [
  body('name').notEmpty().withMessage('Role name is required').trim(),
  body('description').optional().isString().trim(),
];

export const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required').trim(),
];

export const idParamValidation = [
  param('id').isInt().withMessage('ID parameter must be an integer'),
];
