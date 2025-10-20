import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export class TokenProvider {
  generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '1d' });
  }

  verifyToken(token) {
    return jwt.verify(token, SECRET);
  }
}
