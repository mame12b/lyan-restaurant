export const createError = (status, message) => {
    const err = new Error();
    err.statusCode = status;
    err.message = message;
    return err;
  };
  
  export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
      // If headers already sent, delegate to Express's default error handler
      return next(err);
    }
    res.status(500).json({
      error: process.env.NODE_ENV === "production" ? "Server error" : err.message,
    });
  };

  // export const errorHandler = (err, req, res, next) => {
  //   const statusCode = err.statusCode || 500;
  //   res.status(statusCode).json({
  //     success: false,
  //     status: statusCode,
  //     message: err.message || 'Internal Server Error'
  //   });
  // };