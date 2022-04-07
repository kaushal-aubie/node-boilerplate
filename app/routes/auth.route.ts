import { Router } from 'express';
import { authController } from '@/controllers';
import type { IApiRoute } from '@/interfaces';
import { authMiddleware, validate } from '@/middleware';
import { authValidation } from '@/validations';

class AuthRouter {
  private static apiRouter: Router = Router();

  private static PREFIX = '/auth';

  public static createRoutes = (): IApiRoute => {
    // * Add api routes
    this.apiRouter.route('/login').post(validate(authValidation.login), authController.login);
    this.apiRouter
      .route('/register')
      .post(validate(authValidation.register), authController.register);
    this.apiRouter
      .route('/logout')
      .post(validate(authValidation.logout), authMiddleware.isAuthenticated, authController.logout);
    this.apiRouter
      .route('/authenticate')
      .post(
        validate(authValidation.authenticate),
        authMiddleware.isAuthenticated,
        authController.getUser
      );
    return { router: this.apiRouter, apiPrefix: this.PREFIX };
  };
}
export default AuthRouter;
