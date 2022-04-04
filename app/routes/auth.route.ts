import express from 'express';
import { authController } from '@/controllers';
import { authMiddleware, validate } from '@/middleware';
import { authValidation } from '@/validations';

// Init
const apiRouter = express.Router();
const { isAuthenticated } = authMiddleware;
const { isValid } = validate;

// Add api routes
apiRouter.route('/login').post(isValid(authValidation.login), authController.login);
apiRouter.route('/register').post(isValid(authValidation.register), authController.register);
apiRouter
  .route('/logout')
  .post(isValid(authValidation.logout), isAuthenticated, authController.logout);
apiRouter
  .route('/authenticate')
  .post(isValid(authValidation.authenticate), isAuthenticated, authController.getUser);

export default apiRouter;
