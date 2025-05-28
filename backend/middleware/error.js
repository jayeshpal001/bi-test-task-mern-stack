// middleware/error.js
import createError from 'http-errors';

export default (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err.stack.red);

  // Mongoose bad ObjectId (Cast Error)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = createError(404, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = createError(400, messages.join('. '));
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = createError(409, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = createError(401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = createError(401, 'Token expired');
  }

  // Default to 500 server error
  if (!error.statusCode) {
    error = createError(500, 'Server Error');
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};