import { Usuario } from './Usuario.js';
import { InvalidCredentialsError, UserAlreadyExistsError, UserNotFoundError, AreaNotFoundError } from './authErrors.js'
import { TokenProvider } from './TokenService.js';
import { PasswordProvider } from './PasswordProvider.js'
import { UsuarioRepository } from './UsuarioRepository.js';

const usuarioRepository = new UsuarioRepository();
const passwordProvider = new PasswordProvider();
const tokenProvider = new TokenProvider();

export class AuthService {

  async register(username, password, name, role) {
    const existing = await usuarioRepository.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hash = await passwordProvider.hashPassword(password);
    const user = await usuarioRepository.create({
      username, 
      passwordHash: hash, 
      name, 
      role
    });
    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = tokenProvider.generateToken(tokenPayload);
    res.json = user;
    return { user, token };
  }

  async login(username, password) {
    const user = await usuarioRepository.findByUsername(username);
    if (!user) throw new UserNotFoundError('Usuario no encontrado');
    const valid = await passwordProvider.comparePassword(password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError('Credenciales inválidas');

    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = tokenProvider.generateToken(tokenPayload);
    return { user, token };
  }

  async getUserById(id) {
    const user = await usuarioRepository.findById(id);
    if (!user) throw new UserNotFoundError('Usuario no encontrado');
    return user;
  }

  async findUserArea(id) {
    const area = await usuarioRepository.findUserArea(id);
    if (!area) throw new AreaNotFoundError('Área no encontrada para el coordinador');
    return area.nombre; 
  }
}