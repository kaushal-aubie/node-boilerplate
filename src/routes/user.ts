import express from 'express';
import { UserController } from '@/controllers';
import { AuthMiddleware } from '@/middleware';

// Init
const apiRouter = express.Router();

// Add api routes
apiRouter.get(
  '/getAll',
  AuthMiddleware.isAuthenticated,
  UserController.getAllUsers
);
apiRouter.get(
  '/getOne/:id',
  AuthMiddleware.isAuthenticated,
  UserController.getUserById
);

export default apiRouter;
