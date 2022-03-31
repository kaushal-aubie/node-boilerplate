import express from 'express';
import { UserController } from '@/controllers';
import { AuthMiddleware } from '@/middleware';

// Init
const apiRouter = express.Router();

// Add api routes
apiRouter.get(
  '/user',
  AuthMiddleware.isAuthenticated,
  UserController.getUserById
);
apiRouter.get(
  '/user:id',
  AuthMiddleware.isAuthenticated,
  UserController.getAllUsers
);

export default apiRouter;
