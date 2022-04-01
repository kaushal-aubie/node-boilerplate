import express from 'express';
import { authController } from '@/controllers';
import { authMiddleware, validate } from '@/middleware';
import { authValidation } from '@/validations';

// Init
const apiRouter = express.Router();

// Add api routes
apiRouter.post('/login', validate(authValidation.login), authController.login);
apiRouter.post(
  '/register',
  validate(authValidation.register),
  authController.register
);
apiRouter.post(
  '/logout',
  validate(authValidation.logout),
  authMiddleware.isAuthenticated,
  authController.logout
);
apiRouter.post(
  '/authenticate',
  validate(authValidation.authenticate),
  authMiddleware.isAuthenticated,
  authController.getUser
);

export default apiRouter;
