// Centralized error-handling middleware.
// Must be registered AFTER all routes.
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`);

  res.status(statusCode).json({
    message: err.message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
