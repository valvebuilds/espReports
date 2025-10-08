// middlewares/requireArea.js
import prisma from '../prisma/prismaClient.js';

export const requireArea = () => {
  return async (req, res, next) => {
    try {
      const usuarioId = req.user.id;

      // Si es ADMIN, dejar pasar
      if (req.user.rol === 'ADMIN') return next();

      // Buscar las áreas en las que este usuario es coordinador
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        include: {
          coordinador: {
            select: { id: true, nombre: true }
          }
        }
      });

      if (!usuario || usuario.coordinador.length === 0) {
        return res.status(403).json({ message: 'No está asignado como coordinador de ningún área' });
      }
      console.log(req.coordinadorAreas);
      // Guardar las áreas en req para usarlas más adelante en el controlador o servicio
      req.coordinadorAreas = usuario.coordinador.map(area => area.id);

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error verificando área del coordinador' });
    }
  };
};
