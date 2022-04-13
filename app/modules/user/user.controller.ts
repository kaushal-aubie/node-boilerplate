import { ApolloError } from 'apollo-server-express';
import type { Request, Response } from 'express';
import { IContext } from '@/interfaces';
import { logger } from '@/libs';
import { ApiErrors, ApiResponse } from '@/response_builder';
import { IGetOneRequest } from './user.types';

class UserController {
  /**
   ** Get a user by ID.
   */
  public static async getOne(_source: unknown, { input }: IGetOneRequest, { services }: IContext) {
    try {
      logger.info('CONTROLLER ==> 1:: Inside UserController.getOne()');
      logger.info('CONTROLLER ==> 2:: Finding User in DB');
      const userRes = await services.userService.getUserById(input.id);
      logger.info('CONTROLLER ==> 3:: User Data Fetched');
      return userRes.result;
    } catch (error) {
      logger.err('# ERROR :: Inside UserController.getOne()', error);
      throw new ApolloError(error as never);
    }
  }

  /**
   ** Get all users.
   */
  public static async getAllUsers(_source: unknown, _args: unknown, { services }: IContext) {
    try {
      logger.info('CONTROLLER ==> 1:: Inside UserController.getAllUsers()');
      logger.info('CONTROLLER ==> 2:: Finding Users in DB');
      const userRes = await services.userService.getAllUsers();
      logger.info('CONTROLLER ==> 3:: Users Data Fetched');
      return userRes.result;
    } catch (error) {
      logger.err('# ERROR :: Inside UserController.getOne()', error);
      throw new ApolloError(error as never);
    }
  }

  /**
   ** Upload A File.
   */
  public static uploadFiles(req: Request, res: Response) {
    try {
      if (!req.file) {
        const err = ApiErrors.newBadRequestError('File not found');
        ApiErrors.sendError(res, err);
        return;
      }
      const fileData = { fileName: req.file.filename, filePath: req.file.path };

      const r = ApiResponse.newResponse({
        data: fileData,
        message: 'File uploaded successfully!',
      });
      ApiResponse.sendResponse(res, r);
    } catch (err) {
      logger.err('# Error while file upload in UserController.uploadFiles()', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.sendError(res, er);
    }
  }
}

export default UserController;
