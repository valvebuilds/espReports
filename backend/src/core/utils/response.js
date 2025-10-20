/**
 * Standardized response utilities
 */
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const sendError = (res, error, statusCode = 500) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse = {
    success: false,
    message: error.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  };

  // Include additional error details in development
  if (isDevelopment) {
    errorResponse.stack = error.stack;
    errorResponse.type = error.type || 'UNKNOWN_ERROR';
    if (error.field) errorResponse.field = error.field;
  }

  res.status(statusCode).json(errorResponse);
};

export const sendValidationError = (res, message, field = null) => {
  res.status(400).json({
    success: false,
    message,
    field,
    type: 'VALIDATION_ERROR',
    timestamp: new Date().toISOString()
  });
};
