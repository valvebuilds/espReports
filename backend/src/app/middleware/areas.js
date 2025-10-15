// middlewares/requireArea.js
import prisma from '../../shared/prisma/prismaClient.js';

export async function requireArea(req, res, next) {
    if (!req.user || !req.user.id || !req.user.role) {
      return res.status(401).json({ message: 'Acceso denegado: Información de usuario no disponible.' });
    }
    try {
      const { id: usuarioId } = req.user;
      const rol = req.user.role;
      // Si es ADMIN, conceder acceso total e ignorar la restricción de área.
      if (rol === 'ADMIN') {
        return next();
      }
      // Solo para COORDINADOR: Buscar las áreas asociadas.
      if (rol === 'COORDINADOR') {
        const usuario = await prisma.usuario.findUnique({
          where: { id: usuarioId },
          include: {
            coordinador: {
              select: { id: true } // Solo necesitamos el ID
            }
          }
        });
        // Verificar si coordina al menos un área
        if (!usuario || !usuario.coordinador || usuario.coordinador.length === 0) {
          return res.status(403).json({ message: 'Acceso denegado: No está asignado como coordinador de ningún área.' });
        }
        // Inyectar los IDs de área en el objeto req
        req.coordinadorAreas = usuario.coordinador.map(area => area.id);
        //Continuar con la siguiente función (el controlador)
        return next();
      }
      // Si el rol es EMPLEADO o cualquier otro que llegue aquí:
      return res.status(403).json({ message: 'Acceso denegado: El rol no tiene permisos de área.' });

    } catch (err) {
      console.error('Error en requireArea:', err);
      // Captura cualquier error de Prisma o de la base de datos.
      return res.status(500).json({ message: 'Error interno al verificar permisos de área.' });
    }
  };

