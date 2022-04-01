import express from 'express';
import { userController } from '@/controllers';
import { authMiddleware, validate } from '@/middleware';
import { userValidation } from '@/validations';

// Init
const apiRouter = express.Router();

// Add api routes
apiRouter
  .route('/getAll')
  .get(
    validate(userValidation.getAll),
    authMiddleware.isAuthenticated,
    userController.getAllUsers
  );
apiRouter
  .route('/getOne/:id')
  .get(
    validate(userValidation.getOne),
    authMiddleware.isAuthenticated,
    userController.getUserById
  );

export default apiRouter;
