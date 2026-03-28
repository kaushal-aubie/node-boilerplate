import jwt, { type SignOptions } from 'jsonwebtoken';
import { envVars } from '@/config/env';
import { logger } from '@/lib/logger';

const algorithm: jwt.Algorithm = 'HS256';

export function createAccessToken(userId: number): string {
  const options: SignOptions = {
    algorithm,
    expiresIn: (envVars.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'],
  };
  return jwt.sign({ user_id: String(userId) }, envVars.JWT_SECRET, options);
}

export function verifyAccessToken(token: string): Promise<{ user_id: string }> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, envVars.JWT_SECRET, { algorithms: [algorithm] }, (err, payload) => {
      if (err) {
        logger.debug({ err }, 'JWT verify failed');
        reject(err);
      } else {
        resolve(payload as { user_id: string });
      }
    });
  });
}
