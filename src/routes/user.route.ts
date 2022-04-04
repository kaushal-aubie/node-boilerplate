import express from 'express';
import { storageType, uploadType } from '@/config';
import { userController } from '@/controllers';
import { authMiddleware, uploader, validate } from '@/middleware';
import { userValidation } from '@/validations';

// Init
const apiRouter = express.Router();

// Constants
const FILE_KEY = 'myFile';

// Add api routes
apiRouter
  .route('/getAll')
  .get(validate(userValidation.getAll), authMiddleware.isAuthenticated, userController.getAllUsers);
apiRouter
  .route('/getOne/:id')
  .get(validate(userValidation.getOne), authMiddleware.isAuthenticated, userController.getUserById);

apiRouter
  .route('/fille/upload')
  .post(
    authMiddleware.isAuthenticated,
    uploader.upload(storageType.DISK, uploadType.SINGLE, FILE_KEY),
    userController.uploadFiles
  );
export default apiRouter;
