import type { NextFunction, Request, Response } from 'express';
import { Jwt, logger } from '@/libs';
import { User } from '@/models';
import { ApiErrors } from '@/response_builder';
import { TokenUtils } from '@/utils';

export default class AuthMiddleware {
  /**
   ** Checks whether user is Authenticated or not
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns Request with User Object
   */
  public static async isAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
      const token = TokenUtils.getToken(req);
      if (!token) {
        const er = ApiErrors.newNotAuthorizedError('Token not Found');
        ApiErrors.sendError(res, er);
        return;
      }
      const tokenVerificationRes = await Jwt.verify(token);
      const user = await User.findByPk(tokenVerificationRes.user_id);
      if (!user || !user.id) {
        const er = ApiErrors.newNotAuthorizedError('Not authorized');
        ApiErrors.sendError(res, er);
        return;
      }
      // append user data to request object
      (req as Request & { user: User }).user = user;
      next();
    } catch (err) {
      logger.err('# Error while authenticating a user in AuthMiddleware.isAuthenticated()', err);
      const er = ApiErrors.newNotAuthorizedError('Not authorized');
      ApiErrors.sendError(res, er);
    }
  }
}
