// // backend/middleware/errorMiddleware.js
// export const errorHandler = (err, req, res, _next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode).json({
//     message: err.message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack
//   });
// };

// export const notFound = (req, res, next) => {
//   const error = new Error(`Not found - ${req.originalUrl}`);
  
//   res.status(404);
//   next(error);
// };

export const notFound = (req, res, next) => {
  // Mark response as 404 and attach a status code to the error object
  res.status(404);
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, _next) => {
  // Determine the status code to use:
  // - if a non-200 status was already set on the response, prefer it
  // - otherwise use err.statusCode if present
  // - otherwise default to 500
  const statusCode =
    (res.statusCode && res.statusCode !== 200) ? res.statusCode : (err.statusCode || 500);

  // Set the response status
  res.status(statusCode);

  // Log appropriately: full error for server errors (5xx), lighter logging for client errors (4xx)
  if (statusCode >= 500) {
    // Use console.error here; your app may replace this with a structured logger elsewhere
    console.error('Server Error:', err);
  } else {
    // Avoid noisy stack traces for 4xx client errors
    console.warn('Client Error:', err.message || err);
  }

  // Send JSON response; include stack only in non-production environments
  res.json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'production' ? {} : { stack: err.stack })
  });
};