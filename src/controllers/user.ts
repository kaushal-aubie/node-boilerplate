import { Request, Response } from 'express';
import { ApiErrors, ApiResponse } from '@/shared';
import { UserService } from '@/services';

class UserController {
  public static async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      if (!userId) {
        const er = ApiErrors.newBadRequestError('UserID not provided');
        res.status(er.status);
        res.json(er);
        return;
      }

      const userRes = await UserService.getUserById(userId);
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
      console.log('UserController.getUser() error: ', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

  public static async getAllUsers(_req: Request, res: Response) {
    try {
      const userRes = await UserService.getAllUsers();
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
      console.log('UserController.getUser() error: ', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }
}

export default UserController;
