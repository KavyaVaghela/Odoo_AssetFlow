import { body, param, validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return errorResponse(res, 'Validation Error', formattedErrors, 400);
  }
  next();
};

export const idParamValidation = [
  param('id').isInt().withMessage('ID must be a valid integer')
];

export const bookingValidation = [
  body('resource_id').isInt().withMessage('Resource ID must be an integer'),
  body('booking_title').notEmpty().withMessage('Booking title is required'),
  body('purpose').optional().isString(),
  body('booking_date').isDate().withMessage('Invalid booking date format (YYYY-MM-DD)'),
  body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Invalid start time format (HH:MM)'),
  body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Invalid end time format (HH:MM)')
];

export const maintenanceValidation = [
  body('asset_id').isInt().withMessage('Asset ID must be an integer'),
  body('issue_title').notEmpty().withMessage('Issue title is required'),
  body('issue_description').notEmpty().withMessage('Issue description is required'),
  body('priority').isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority level')
];

export const requestValidation = [
  body('request_type').isIn(['Asset Request', 'Software Installation', 'Hardware Upgrade', 'Access Request', 'General Request']).withMessage('Invalid request type'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
];

export const profileValidation = [
  body('phone').optional().isString(),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];
