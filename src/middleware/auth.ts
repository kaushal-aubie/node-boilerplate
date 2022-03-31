import { NextFunction, Request, Response } from 'express';
import { Jwt } from '@/libs';
import { User } from '@/models';
import { ApiErrors } from '@/shared';
import { TokenUtils } from '@/utils';

export default class AuthMiddleware {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns Request with User Object
   */
  public static async isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = TokenUtils.getToken(req);
      if (!token) {
        const er = ApiErrors.newNotAuthorizedError('Token not Found');
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
        const er = ApiErrors.newNotAuthorizedError('Not authorized');
        res.status(er.status);
        res.json(er);
        return;
      }
      // append user data to request object
      (req as Request & { user: User }).user = user;
      next();
    } catch (err) {
      console.error('AuthMiddleware.isAuthentication() ERR: ', err);
      const er = ApiErrors.newNotAuthorizedError('Not authorized');
      res.status(er.status);
      res.json(er);
    }
  }
}
