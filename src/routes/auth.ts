import express from 'express';
import authController from '../controllers/auth';
import authMiddleware from '../middlewares/auth';

// Init
const apiRouter = express.Router();

// Add api routes
apiRouter.post('/signin', authController.signin);
apiRouter.post('/signup', authController.signup);
apiRouter.post(
  '/signout',
  authMiddleware.isAuthenticated,
  authController.signout
);
apiRouter.post(
  '/authenticate',
  authMiddleware.isAuthenticated,
  authController.getUser
);

export default apiRouter;
