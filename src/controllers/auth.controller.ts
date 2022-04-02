import { Request, Response } from 'express';
import { Jwt, logger } from '@/libs';
import { IUser } from '@/models';
import { authService } from '@/services';
import { ApiErrors, ApiResponse } from '@/shared';
import { TokenUtils } from '@/utils';
import {
  IUserSignupVM,
  IUserVM,
  UserSignupViewModel,
  UserViewModel,
} from '@/viewModels';

class AuthController {
  /**
   * POST /register
   * Register a user.
   */
  public static async register(req: Request, res: Response) {
    try {
      const user = new UserSignupViewModel(req.body as IUserSignupVM);
      // validating user body
      if (!user || !user.email || !user.password) {
        const er = ApiErrors.newBadRequestError(
          'Email or password not provided'
        );
        res.status(er.status);
        res.json(er);
        return;
      }
      // user signup call
      const registerRes = await authService.register(user);
      if (registerRes.error) {
        res.status(registerRes.error.status);
        res.json(registerRes.error);
        return;
      }

      // crating a response object
      const userVM = new UserViewModel(
        registerRes.result as unknown as IUserVM
      );
      const r = ApiResponse.newResponse({
        data: userVM,
        message: 'User has Registered successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

  /**
   * POST /login
   * login's a user.
   */
  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as IUser;
      // validating user body
      if (!email || !password) {
        const er = ApiErrors.newBadRequestError(
          'Email or password not provided'
        );
        res.status(er.status);
        res.json(er);
        return;
      }

      const loginRes = await authService.login(email, password);
      if (loginRes.error) {
        res.status(loginRes.error.status);
        res.json(loginRes.error);
        return;
      }

      const userVM = new UserViewModel(loginRes.result as unknown as IUserVM);

      // generate jwt token
      const token = Jwt.create({
        user_id: (loginRes.result as unknown as { id: string })?.id,
      });
      if (!token) {
        const er = ApiErrors.newInternalServerError('Something went wrong');
        res.status(er.status);
        res.json(er);
        return;
      }
      logger.info('Token generated successfully');
      res = TokenUtils.setToken(req, res, token);
      const r = ApiResponse.newResponse({
        data: { response: userVM, token },
        message: 'User has logged in successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

  /**
   * POST /logout
   * logout's a user.
   */
  public static logout(_req: Request, res: Response) {
    try {
      res = TokenUtils.clearToken(res);
      const r = ApiResponse.newResponse({
        message: 'User has logout successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

  /**
   * get /authenticate
   * To get Logged in User Details.
   */
  public static getUser(req: Request, res: Response) {
    try {
      const userVM = new UserViewModel(
        (req as Request & { user: IUserVM }).user
      );
      const r = ApiResponse.newResponse({
        data: userVM,
        message: 'Signed in user',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      logger.err('AuthController.getUser() error: ', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }
}

export default AuthController;
