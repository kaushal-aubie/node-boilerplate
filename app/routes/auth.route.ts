import express from 'express';
import { authController } from '@/controllers';
import { authMiddleware, validate } from '@/middleware';
import { authValidation } from '@/validations';

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
