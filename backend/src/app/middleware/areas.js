// middlewares/requireArea.js
import prisma from '../../shared/prisma/prismaClient.js';
/**
 * middleware de verificación de área
 * - ADMIN: pasa sin restricción de área
 * - COORDINADOR: inyecta ids de áreas coordinadas en req.user.areas
 * - Otros roles: 403 (sin permisos de área)
 *
 * Nota: El filtrado de roles debe hacerse con requireRole en el route.
 */
export async function requireArea(req, res, next) {
  if (!req.user || !req.user.id || !req.user.role) {
    return res.status(401).json({ message: 'Acceso denegado: Información de usuario no disponible.' });
  }

  const userId = req.user.id;
  const role = req.user.role;

  try {
    // ADMIN: acceso total
    if (role === 'ADMIN') {
      return next();
    }

    // COORDINADOR: obtener áreas a cargo e inyectarlas
    if (role === 'COORDINADOR') {
      const areas = await prisma.area.findMany({
        where: { coordinadorId: userId },
        select: { id: true }
      });

      if (!areas || areas.length === 0) {
        return res.status(403).json({ message: 'Acceso denegado: No está asignado como coordinador de ningún área.' });
      }

      req.user.areas = areas.map(a => a.id);
      return next();
    }

    // Otros roles: sin permisos de área
    return res.status(403).json({ message: 'Acceso denegado: El rol no tiene permisos de área.' });
  } catch (err) {
    console.error('Error en requireArea:', err);
    return res.status(500).json({ message: 'Error interno al verificar permisos de área.' });
  }
}

