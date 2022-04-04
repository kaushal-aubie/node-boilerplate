import type { Response, Request } from 'express';
import { envVars } from '@/config';

const mins = envVars.jwt.cookieExpire ? parseInt(envVars.jwt.cookieExpire, 10) : 15;

const JWT_EXPIRES_IN = 1000 * 60 * mins;
if (envVars.jwt.jwtExpireIn) {
  parseInt(envVars.jwt.jwtExpireIn, 10);
}

class TokenUtils {
  /**
   ** Set a token from the response header
   * @param {Request}  req
   * @param {Response}  res
   * @param {string}  token
   * @param options
   * @returns res
   */
  public static setToken(
    req: Request,
    res: Response,
    token: string,
    options: { maxAge?: number } = {}
  ): Response {
    if (req.cookies) {
      res.cookie('token', token, {
        maxAge: options.maxAge || JWT_EXPIRES_IN,
        httpOnly: true,
        signed: true,
      });
    }
    // * Setting header also
    res.setHeader('Authorization', `bearer ${token}`);
    return res;
  }

  /**
   ** Retrieves a token from the request body
   * @param {Request} req
   * @returns token
   */
  public static getToken(req: Request) {
    if (req.signedCookies) {
      const t = (req.signedCookies as { token: string }).token;
      if (t) {
        return t;
      }
    }
    const token = req.headers.authorization;
    return token;
  }

  /**
   ** Clears a token from response header
   * @param {Response} req
   * @returns res
   */
  public static clearToken(res: Response): Response {
    res.cookie('token', '', {
      maxAge: 0,
      httpOnly: true,
      signed: true,
    });
    res.setHeader('Authorization', 'bearer  ');
    return res;
  }
}

export default TokenUtils;
