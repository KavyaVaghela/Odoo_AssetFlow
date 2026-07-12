const { body, param, validationResult } = require('express-validator');
const response = require('../utils/response');

/**
 * Runner middleware to validate checks and return standardized JSON payload errors
 */
const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return response.error(res, 'Validation failed.', 400, errors.array());
  };
};

// 1. Profile update validation
const updateProfile = validate([
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a valid string format')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 digits'),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
]);

// 2. Resource Booking / Calendar slot reservation
const bookingSlot = validate([
  body('resource_id')
    .isInt()
    .withMessage('Resource ID must be a valid integer'),
  body('booking_title')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Booking title is required'),
  body('booking_date')
    .isISO8601()
    .withMessage('Booking date must be in YYYY-MM-DD date format'),
  body('start_time')
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .withMessage('Start time must be in HH:MM or HH:MM:SS format'),
  body('end_time')
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .withMessage('End time must be in HH:MM or HH:MM:SS format')
]);

// 3. Technician assignment schema
const assignTechnician = validate([
  body('assigned_to')
    .isInt()
    .withMessage('Assigned technician user ID must be a valid integer')
]);

module.exports = {
  updateProfile,
  bookingSlot,
  assignTechnician
};
