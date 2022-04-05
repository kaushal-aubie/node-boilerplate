import type { Router } from 'express';
import { authController } from '@/controllers';
import type { IApiRoute } from '@/interfaces';
import { authMiddleware, validate } from '@/middleware';
import { authValidation } from '@/validations';

class AuthRouter {
  private static PREFIX = '/auth';

  public static createRoutes = (apiRouter: Router): IApiRoute => {
    // * Add api routes
    apiRouter.route('/login').post(validate(authValidation.login), authController.login);
    apiRouter.route('/register').post(validate(authValidation.register), authController.register);
    apiRouter
      .route('/logout')
      .post(validate(authValidation.logout), authMiddleware.isAuthenticated, authController.logout);
    apiRouter
      .route('/authenticate')
      .post(
        validate(authValidation.authenticate),
        authMiddleware.isAuthenticated,
        authController.getUser
      );
    return { router: apiRouter, apiPrefix: this.PREFIX };
  };
}
export default AuthRouter;
