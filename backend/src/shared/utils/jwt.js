import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Genera token de acceso que expira en 5 minutos
function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '5m',
  });
}

// Generar un token de refresh
function generateRefreshToken() {
  const token = crypto.randomBytes(16).toString('base64url');
  return token;
}

function generateTokens(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  return { accessToken, refreshToken };
}

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
