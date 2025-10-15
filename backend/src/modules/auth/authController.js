import { AuthService } from './authService.js';

const authService = new AuthService();
//Inicio de sesión
const login = async (req, res) => {
  const { username, password } = req.body;
  const token = await authService.login(username, password) 
  res.json({ user, token });
};

//Registro, solo pueden usar los admin
const register = async (req, res) => {
  const { username, password, name, role } = req.body;
  const user = await authService.register(username, password, name, role);
  res.json({ id: user.id, username: user.username, name: user.name, role: user.role });
};

export default {
    login,
    register
}