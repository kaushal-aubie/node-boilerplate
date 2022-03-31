import { Request, Response } from 'express';
import { Jwt } from '@/libs';
import { IUser } from '@/models';
import { AuthService } from '@/services';
import { ApiErrors, ApiResponse } from '@/shared';
import { TokenUtils } from '@/utils';
import {
  IUserSignupVM,
  IUserVM,
  UserSignupViewModel,
  UserViewModel,
} from '@/viewModels';

class AuthController {
  public static async signup(req: Request, res: Response) {
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
      const singupRes = await AuthService.signup(user);
      if (singupRes.error) {
        res.status(singupRes.error.status);
        res.json(singupRes.error);
        return;
      }

      // crating a response object
      const userVM = new UserViewModel(singupRes.result as unknown as IUserVM);
      const r = ApiResponse.newResponse({
        data: userVM,
        message: 'User has signup successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

  public static async signin(req: Request, res: Response) {
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

      const signinRes = await AuthService.signin(email, password);
      if (signinRes.error) {
        res.status(signinRes.error.status);
        res.json(signinRes.error);
        return;
      }

      const userVM = new UserViewModel(signinRes.result as unknown as IUserVM);

      // generate jwt token
      const token = Jwt.create({
        user_id: (signinRes.result as unknown as { id: string })?.id,
      });
      if (!token) {
        const er = ApiErrors.newInternalServerError('Something went wrong');
        res.status(er.status);
        res.json(er);
        return;
      }
      console.log('Token generated successfully');
      res = TokenUtils.setToken(req, res, token);
      const r = ApiResponse.newResponse({
        data: { response: userVM, token },
        message: 'User has signin successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

  public static signout(_req: Request, res: Response) {
    try {
      res = TokenUtils.clearToken(res);
      const r = ApiResponse.newResponse({
        message: 'User has signout successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

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
      console.log('AuthController.getUser() error: ', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }
}

export default AuthController;
