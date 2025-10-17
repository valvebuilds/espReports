import { AuthService } from './authService.js';

const authService = new AuthService();
//Inicio de sesión
const login = async (req, res) => {
  const { username, password } = req.body;
  const {user, token} = await authService.login(username, password) ;
  if (user.role === 'COORDINADOR') {
    const area = await authService.findUserArea(user.id);
    user.area = area ? area : 'Área no asignada';
  } else {
    user.area = 'default';
  }
  res.json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role, areas: user.area } });
};

//Registro, solo pueden usar los admin
const register = async (req, res) => {
  const { usuario, contrasena, nombre, rol } = req.body;
   if (!usuario || !contrasena || !rol || !nombre) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const user = await authService.register(usuario, contrasena, nombre, rol );
  res.json({ id: user.id, username: user.username, name: user.name, role: user.role });
};

export default {
    login,
    register
}