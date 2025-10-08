export function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado: rol no autorizado' });
    }

    next();
  };
}
