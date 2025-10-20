import { AppError } from '../errors/AppError.js';
/**
 * wrapper para manejo de errores en rutas asíncronas
 * elimina la necesidad de usar bloques try-catch en controladores
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * función de wrapper para manejo de errores en servicios
 */
export const serviceWrapper = (serviceMethod) => {
  return async (...args) => {
    try {
      return await serviceMethod(...args);
    } catch (error) {
      // re-lanzar instancias de AppError como están
      if (error instanceof Error && error.statusCode) {
        throw error;
      }
      
      // Wrap unexpected errors
      throw new AppError(
        error.message || 'Ha ocurrido un error inesperado',
        500,
        false
      );
    }
  };
};
