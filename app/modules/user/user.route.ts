import type { Router } from 'express';
import { storageType, uploadType } from '@/config';
import type { IApiRoute } from '@/interfaces';
import { authMiddleware, uploader, validate } from '@/middleware';
import { USER_ROUTE_PREFIX } from './user.constants';
import userController from './user.controller';
import userValidation from './user.validation';

class UserRouter {
  private static FILE_KEY = 'myFile';

  private static PREFIX = USER_ROUTE_PREFIX;

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
