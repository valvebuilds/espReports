import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prismaClient.js';

const authRouter = express.Router();

// Registrar usuario (puedes usarlo una sola vez para crear cuentas internas)
authRouter.post('/register', async (req, res) => {
  const { username, password, name, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Faltan datos' });

  const existing = await prisma.usuario.findUnique({ where: { usuario: username } });
  if (existing) return res.status(400).json({ error: 'Usuario ya existe' });

    const allowedRoles = ['ADMIN', 'COORDINADOR'];
    const assignedRole = allowedRoles.includes(role) ? role : 'EMPLEADO';

     const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.usuario.create({
    data: { usuario: username, contrasena: hashed, nombre: name, rol: assignedRole }
  });

  res.json({ id: user.id, username: user.usuario, role: user.rol });
});

// Login
authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.usuario.findUnique({ where: { usuario: username } });
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

  const ok = await bcrypt.compare(password, user.contrasena);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign(
  { id: user.id, username: user.usuario, role: user.rol },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);

  res.json({ token, role: user.rol });
});

export default authRouter