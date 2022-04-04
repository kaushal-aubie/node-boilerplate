import fs from 'fs';
import jwt from 'jsonwebtoken';
import { envVars, paths } from '@/config';
import logger from './logger';

/**
 * References :- https://jwt.io/
 *               https://www.npmjs.com/package/jsonwebtoken
 */
export default class JwtUtil {
  private static algorithmName: jwt.Algorithm = 'HS256';

  private static privateKey = fs.readFileSync(paths.pemPath ?? '', 'utf8');

  /**
   * Encrypt data and return jwt token
   * @param {{ user_id: string }} payload
   * @returns token
   */
  public static create(payload: { user_id: string }) {
    try {
      const exp = envVars.jwt.jwtExpireIn || '1h';
      const signOptions: jwt.SignOptions = {
        algorithm: JwtUtil.algorithmName,
        expiresIn: exp,
      };
      const token = jwt.sign(payload, JwtUtil.privateKey, signOptions);
      return token || '';
    } catch (err) {
      logger.err('# Error while generating a token in JwtUtil.create()', err);
      return null;
    }
  }

  /**
   * Decrypt JWT and extract client data.
   * @param  {string}  token
   * @returns decoded data
   */
  public static verify(token: string): Promise<{ user_id: string }> {
    return new Promise((resolve, reject) => {
      const verifyOptions = { algorithms: [JwtUtil.algorithmName] };
      jwt.verify(token, JwtUtil.privateKey, verifyOptions, (err, payload) => {
        if (err) {
          logger.err('# Error while verifying a token in JwtUtil.verify()', err);
          reject(err);
        } else {
          resolve(payload as unknown as { user_id: string });
        }
      });
    });
  }
}
