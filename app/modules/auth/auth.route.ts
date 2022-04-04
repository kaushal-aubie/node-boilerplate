import express from 'express';
import { authMiddleware, validate } from '@/middleware';
import authController from './auth.controller';
import authValidation from './auth.validation';

// * Init
const apiRouter = express.Router();

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

export default apiRouter;
