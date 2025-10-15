import bcrypt from 'bcryptjs'

export class PasswordProvider {
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password, hash) {
    console.log(password, hash);
    return bcrypt.compare(password, hash);
  }
}