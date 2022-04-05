import type { Router } from 'express';
import type { IApiRoute } from '@/interfaces';
import { authMiddleware, validate } from '@/middleware';
import { AUTH_ROUTE_PREFIX } from './auth.constants';
import authController from './auth.controller';
import authValidation from './auth.validation';

class AuthRouter {
  private static PREFIX = AUTH_ROUTE_PREFIX;

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
