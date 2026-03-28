import bcrypt from 'bcrypt';
import { logger } from '@/lib/logger';

const SALT_ROUNDS = 8;

export async function hashPassword(plain: string): Promise<string> {
  try {
    return await bcrypt.hash(plain, SALT_ROUNDS);
  } catch (err) {
    logger.error({ err }, 'bcrypt.hash failed');
    throw err;
  }
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch (err) {
    logger.error({ err }, 'bcrypt.compare failed');
    throw err;
  }
}
