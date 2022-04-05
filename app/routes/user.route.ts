import type { Router } from 'express';
import { storageType, uploadType } from '@/config';
import { userController } from '@/controllers';
import type { IApiRoute } from '@/interfaces';
import { authMiddleware, uploader, validate } from '@/middleware';
import { userValidation } from '@/validations';

class UserRouter {
  private static FILE_KEY = 'myFile';

  private static PREFIX = '/user';

  public static createRoutes = (apiRouter: Router): IApiRoute => {
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

    apiRouter
      .route('/fille/upload')
      .post(
        authMiddleware.isAuthenticated,
        uploader.upload(storageType.DISK, uploadType.SINGLE, this.FILE_KEY),
        userController.uploadFiles
      );

    return { router: apiRouter, apiPrefix: this.PREFIX };
  };
}

export default UserRouter;
