import { body, param, validationResult, query } from 'express-validator';
import validator from 'validator';

const EVENT_TYPES = [
  'wedding',
  'engagement',
  'corporate',
  'conference',
  'product-launch',
  'birthday',
  'anniversary',
  'cultural',
  'private-dining',
  'meeting',
  'bridal-shower',
  'other'
];
const LOCATION_TYPES = ['home', 'hotel', 'venue', 'other'];
const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];
const PACKAGE_CATEGORIES = [
  'wedding',
  'corporate',
  'birthday',
  'cultural',
  'private-dining',
  'other',
  'catering',
  'decoration',
  'full-package',
  'venue',
  'photography'
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
];

export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .escape(),
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
];

export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail()
];

export const validateResetPassword = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  param('token')
    .trim()
    .notEmpty().withMessage('Token is required')
];

export const validateCreateBooking = [
  body('eventType')
    .trim()
    .isIn(EVENT_TYPES).withMessage('Invalid event type'),
  body('eventDate')
    .isISO8601().withMessage('Event date must be a valid ISO 8601 date')
    .toDate()
    .custom((value) => value > new Date()).withMessage('Event date must be in the future'),
  body('eventTime')
    .trim()
    .notEmpty().withMessage('Event time is required')
    .matches(/^[0-2][0-9]:[0-5][0-9]$/).withMessage('Event time must be in HH:MM format'),
  body('locationType')
    .trim()
    .isIn(LOCATION_TYPES).withMessage('Invalid location type'),
  body('locationAddress')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Location address cannot exceed 200 characters')
    .escape(),
  body('packageId')
    .trim()
    .isMongoId().withMessage('Invalid package identifier'),
  body('numberOfGuests')
    .optional()
    .isInt({ min: 1, max: 2000 }).withMessage('Number of guests must be between 1 and 2000')
    .toInt(),
  body('advancePayment')
    .optional()
    .isFloat({ min: 0 }).withMessage('Advance payment cannot be negative')
    .toFloat(),
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Special requests cannot exceed 500 characters')
    .escape(),
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Admin notes cannot exceed 1000 characters')
    .escape(),
  body('customerName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Customer name must be between 2 and 50 characters')
    .escape(),
  body('customerPhone')
    .trim()
    .notEmpty().withMessage('Customer phone is required')
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Customer phone must be a valid phone number')
];

export const validateUpdateBookingStatus = [
  body('status')
    .optional()
    .trim()
    .isIn(BOOKING_STATUSES).withMessage('Invalid booking status'),
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Admin notes cannot exceed 1000 characters')
    .escape()
];

export const validateUploadPaymentReceipt = [
  body('paymentReceipt')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Payment receipt reference cannot exceed 200 characters')
    .custom((value) =>
      validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true }) ||
      /^[A-Za-z0-9\s#:/._-]+$/.test(value)
    )
    .withMessage('Payment receipt must be a valid reference or URL')
    .escape(),
  body('advancePayment')
    .optional()
    .isFloat({ min: 0 }).withMessage('Advance payment cannot be negative')
    .toFloat()
];

export const validatePackageCreation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Package name must be between 3 and 100 characters')
    .escape(),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number')
    .toFloat(),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters')
    .escape(),
  body('category')
    .trim()
    .isIn(PACKAGE_CATEGORIES).withMessage('Invalid package category'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100')
    .toFloat(),
  body('image')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Image must be a valid URL'),
  body('features')
    .optional()
    .isArray({ max: 20 }).withMessage('Features must be an array with up to 20 items')
    .custom((value) => value.every((item) => typeof item === 'string'))
    .withMessage('Each feature must be a string')
    .customSanitizer((value) =>
      value
        .map((item) => validator.escape(item.trim()))
        .filter(Boolean)
    ),
  body('eventTypes')
    .optional()
    .isArray({ max: 10 }).withMessage('Event types must be an array with up to 10 items')
    .custom((value) => value.every((item) => EVENT_TYPES.includes(item)))
    .withMessage('Invalid event type provided'),
  body('maxGuests')
    .optional()
    .isInt({ min: 0, max: 5000 }).withMessage('Max guests must be between 0 and 5000')
    .toInt()
];

export const validatePagination = (
  { allowSearch = false } = {}
) => {
  const rules = [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
      .toInt()
  ];

  if (allowSearch) {
    rules.push(
      query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 }).withMessage('Search term must be 1-50 characters')
        .escape()
    );
  }

  return rules;
};

export const validatePackageUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Package name must be between 3 and 100 characters')
    .escape(),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number')
    .toFloat(),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters')
    .escape(),
  body('category')
    .optional()
    .trim()
    .isIn(PACKAGE_CATEGORIES).withMessage('Invalid package category'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100')
    .toFloat(),
  body('image')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Image must be a valid URL'),
  body('features')
    .optional()
    .isArray({ max: 20 }).withMessage('Features must be an array with up to 20 items')
    .custom((value) => value.every((item) => typeof item === 'string'))
    .withMessage('Each feature must be a string')
    .customSanitizer((value) =>
      value
        .map((item) => validator.escape(item.trim()))
        .filter(Boolean)
    ),
  body('eventTypes')
    .optional()
    .isArray({ max: 10 }).withMessage('Event types must be an array with up to 10 items')
    .custom((value) => value.every((item) => EVENT_TYPES.includes(item)))
    .withMessage('Invalid event type provided'),
  body('maxGuests')
    .optional()
    .isInt({ min: 0, max: 5000 }).withMessage('Max guests must be between 0 and 5000')
    .toInt(),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean')
    .toBoolean()
];

export const validateMongoId = (paramName = 'id', message = 'Invalid identifier format') =>
  param(paramName)
    .trim()
    .isMongoId().withMessage(message);

export const validatePackageQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('category')
    .optional()
    .trim()
    .isIn(PACKAGE_CATEGORIES).withMessage('Invalid category filter'),
  query('eventType')
    .optional()
    .trim()
    .isIn(EVENT_TYPES).withMessage('Invalid event type filter'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('minPrice must be a positive number')
    .toFloat(),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('maxPrice must be a positive number')
    .toFloat()
];