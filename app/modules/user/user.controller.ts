import type { Request, Response } from 'express';
import { logger } from '@/libs';
import { ApiErrors, ApiResponse } from '@/response_builder';
import userService from './user.service';

class UserController {
  /**
   ** GET /getOne/:id
   ** Get a user by ID.
   */
  public static async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const userRes = await userService.getUserById(userId);
      if (userRes.error) {
        ApiErrors.sendError(res, userRes.error);
        return;
      }
      const r = ApiResponse.newResponse({
        data: userRes,
        message: 'Fetched User Successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      logger.err('# Error while getting user by id in UserController.getUser()', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.sendError(res, er);
    }
  }

  /**
   ** GET /getAllUsers
   ** Get all users.
   */
  public static async getAllUsers(_req: Request, res: Response) {
    try {
      const userRes = await userService.getAllUsers();
      if (userRes.error) {
        ApiErrors.sendError(res, userRes.error);
        return;
      }
      const r = ApiResponse.newResponse({
        data: userRes,
        message: 'Fetched All Users',
      });
      ApiResponse.sendResponse(res, r);
    } catch (err) {
      logger.err('# Error while getting all users in UserController.getAllUsers()', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.sendError(res, er);
    }
  }

  /**
   ** POST /fille/upload
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
