import { NextFunction, Request, Response } from 'express';
import { Jwt } from '../libs';
import { User } from '../models';
import RestErrors from '../shared/rest_errors';
import { TokenUtils } from '../utils';

export default class AuthMiddleware {
  public static async isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = TokenUtils.getToken(req);
      if (!token) {
        const er = RestErrors.newNotAuthorizedError('Token not Found');
        res.status(er.status);
        res.json(er);
        return;
      }
      const tokenVerificationRes = await Jwt.verify(token);
      console.log(
        'AuthMiddleware.isAuthentication() tokenVerificationRes ',
        tokenVerificationRes
      );
      const user = await User.findByPk(tokenVerificationRes.user_id);
      if (!user || !user.id) {
        const er = RestErrors.newNotAuthorizedError('Not authorized');
        res.status(er.status);
        res.json(er);
        return;
      }
      // append user data to request object
      (req as Request & { user: User }).user = user;
      next();
    } catch (err) {
      console.log('AuthMiddleware.isAuthentication() error: ', err);
      const er = RestErrors.newNotAuthorizedError('Not authorized');
      res.status(er.status);
      res.json(er);
      throw new Error('Not authorized');
    }
  }
}
