import { AppError } from '../../core/errors/AppError.js';
import { sendError } from '../../core/utils/response.js';

/**
 * middleware de manejo de errores
 * manejo de errores para todos los endpoints
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // loguear error para debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'Valor duplicado ingresado';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2025') {
    const message = 'Registro no encontrado';
    error = new AppError(message, 404);
  }

  if (err.code === 'P2003') {
    const message = 'Restricción de clave foránea fallida';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2014') {
    const message = 'El cambio que intenta hacer violaría la relación requerida';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2016') {
    const message = 'Error de interpretación de consulta';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2017') {
    const message = 'Los registros para la relación no están conectados';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2018') {
    const message = 'Los registros requeridos conectados no se encontraron';
    error = new AppError(message, 404);
  }

  if (err.code === 'P2019') {
    const message = 'Error de entrada';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2020') {
    const message = 'Valor fuera de rango para el tipo';
    error = new AppError(message, 400);
  }

  if (err.code === 'P2021') {
    const message = 'La tabla no existe en la base de datos actual';
    error = new AppError(message, 500);
  }

  if (err.code === 'P2022') {
    const message = 'La columna no existe en la base de datos actual';
    error = new AppError(message, 500);
  }

  if (err.code === 'P2027') {
    const message = 'Múltiples errores ocurrieron durante la ejecución de la consulta';
    error = new AppError(message, 400);
  }

  // Prisma validation errors
  if (err.name === 'PrismaClientValidationError') {
    const message = 'Datos inválidos proporcionados';
    error = new AppError(message, 400);
  }

  // Prisma known request errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const message = 'Operación de base de datos fallida';
    error = new AppError(message, 400);
  }

  // Prisma unknown request errors
  if (err.name === 'PrismaClientUnknownRequestError') {
    const message = 'Error desconocido de base de datos';
    error = new AppError(message, 500);
  }

  // Prisma client initialization errors
  if (err.name === 'PrismaClientInitializationError') {
    const message = 'Conexión a base de datos fallida';
    error = new AppError(message, 500);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = new AppError(message, 401);
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';

  sendError(res, error, statusCode);
};

export default errorHandler;