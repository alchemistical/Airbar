// Simplified JWT utils for testing Prisma connection
import jwt from 'jsonwebtoken';
import type { User } from '../types/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function generateTokens(user: User) {
  const payload = {
    userId: user.id,
    email: user.email,
    username: user.username,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}