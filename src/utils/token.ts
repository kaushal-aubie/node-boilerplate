import { Response, Request } from 'express';

const mins = process.env.TOKEN_COOKIE_EXPIRE
  ? parseInt(process.env.TOKEN_COOKIE_EXPIRE, 10)
  : 15;

const JWT_EXPIRES_IN = 1000 * 60 * mins;
if (process.env.JWT_EXPIRES_IN) {
  parseInt(process.env.JWT_EXPIRES_IN, 10);
}

class TokenUtils {
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
    // Setting header also
    res.setHeader('Authorization', `bearer ${token}`);
    return res;
  }

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
