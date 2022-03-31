import express from 'express';
import { AuthController } from '@/controllers';
import { AuthMiddleware } from '@/middleware';

// Init
const apiRouter = express.Router();

// Add api routes
apiRouter.post('/signin', AuthController.signin);
apiRouter.post('/signup', AuthController.signup);
apiRouter.post(
  '/signout',
  AuthMiddleware.isAuthenticated,
  AuthController.signout
);
apiRouter.post(
  '/authenticate',
  AuthMiddleware.isAuthenticated,
  AuthController.getUser
);

export default apiRouter;
