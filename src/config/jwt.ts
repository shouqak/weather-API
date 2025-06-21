import { SignOptions } from 'jsonwebtoken';

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef",
  accessToken: {
    options: {
      expiresIn: '15m',
      algorithm: 'HS256',
    } as SignOptions,
  },
  refreshToken: {
    options: {
      expiresIn: '7d',
      algorithm: 'HS256',
    } as SignOptions,
  },
}; 