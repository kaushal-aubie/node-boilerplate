import express from 'express';
import { storageType, uploadType } from '@/config';
import { userController } from '@/controllers';
import { authMiddleware, uploader, validate } from '@/middleware';
import { userValidation } from '@/validations';

class UserRouter {
  private static apiRouter = express.Router();

  private static FILE_KEY = 'myFile';

  public static createRoutes = () => {
    this.apiRouter
      .route('/getAll')
      .get(
        validate(userValidation.getAll),
        authMiddleware.isAuthenticated,
        userController.getAllUsers
      );
    this.apiRouter
      .route('/getOne/:id')
      .get(
        validate(userValidation.getOne),
        authMiddleware.isAuthenticated,
        userController.getUserById
      );

    this.apiRouter
      .route('/fille/upload')
      .post(
        authMiddleware.isAuthenticated,
        uploader.upload(storageType.DISK, uploadType.SINGLE, this.FILE_KEY),
        userController.uploadFiles
      );

    return this.apiRouter;
  };
}

export default UserRouter;
