import { Request, Response } from 'express';
import { logger } from '@/libs';
import { userService } from '@/services';
import { ApiErrors, ApiResponse } from '@/shared';

class UserController {
  /**
   * GET /getOne/:id
   * Get a user by ID.
   */
  public static async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      if (!userId) {
        const er = ApiErrors.newBadRequestError('UserID not provided');
        res.status(er.status);
        res.json(er);
        return;
      }

      const userRes = await userService.getUserById(userId);
      if (userRes.error) {
        res.status(userRes.error.status);
        res.json(userRes.error);
        return;
      }
      const r = ApiResponse.newResponse({
        data: userRes,
        message: 'Fetched User Successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      logger.err('UserController.getUser() error: ', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

  /**
   * GET/getAllUsers
   * Get all users.
   */
  public static async getAllUsers(_req: Request, res: Response) {
    try {
      const userRes = await userService.getAllUsers();
      if (userRes.error) {
        res.status(userRes.error.status);
        res.json(userRes.error);
        return;
      }
      const r = ApiResponse.newResponse({
        data: userRes,
        message: 'Fetched All Users',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      logger.err('UserController.getUser() error: ', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }
}

export default UserController;
