import express from 'express';
import { authController } from '@/controllers';
import { authMiddleware, validate } from '@/middleware';
import { authValidation } from '@/validations';

class AuthRouter {
  private static apiRouter = express.Router();

  public static createRoutes = () => {
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
    return this.apiRouter;
  };
}
export default AuthRouter;
