import logger from './logger.js';

export const createError = (status, message) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  logger.error({
    err,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    userId: req.user?._id
  }, 'Request failed');

  const response = {
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Server error'
      : err.message
  };

  res.status(statusCode).json(response);
};
