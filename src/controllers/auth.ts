import { Request, Response } from 'express';
import { IUser } from '../models/user';
import TokenUtils from '../utils/token';
import AuthService from '../services/auth';
import JwtUtil from '../libs/jwt';
import RestResponse from '../shared/rest_response';
import {
  IUserSignupVM,
  IUserVM,
  UserSignupViewModel,
  UserViewModel,
} from '../view_models/user_vm';
import RestErrors from '../shared/rest_errors';

class AuthController {
  public static async signup(req: Request, res: Response) {
    try {
      const user = new UserSignupViewModel(req.body as IUserSignupVM);
      // validating user body
      if (!user || !user.email || !user.password) {
        const er = RestErrors.newBadRequestError(
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
      const userVM = new UserViewModel(singupRes.result as IUserVM);
      const r = RestResponse.newResponse({
        data: userVM,
        message: 'User has signup successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      const er = RestErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

  public static async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body as IUser;
      // validating user body
      if (!email || !password) {
        const er = RestErrors.newBadRequestError(
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

      const userVM = new UserViewModel(signinRes.result as IUserVM);

      // generate jwt token
      const token = JwtUtil.create({
        user_id: (signinRes.result as { id: string })?.id,
      });
      if (!token) {
        const er = RestErrors.newInternalServerError('Something went wrong');
        res.status(er.status);
        res.json(er);
        return;
      }
      console.log('Token generated successfully');
      res = TokenUtils.setToken(req, res, token);
      const r = RestResponse.newResponse({
        data: { response: userVM, token },
        message: 'User has signin successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      const er = RestErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

  public static signout(_req: Request, res: Response) {
    try {
      res = TokenUtils.clearToken(res);
      const r = RestResponse.newResponse({
        message: 'User has signout successfully',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      const er = RestErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }

  public static getUser(req: Request, res: Response) {
    try {
      const userVM = new UserViewModel(
        (req as Request & { user: IUserVM }).user
      );
      const r = RestResponse.newResponse({
        data: userVM,
        message: 'Signed in user',
      });
      res.status(r.status);
      res.json(r);
    } catch (err) {
      console.log('AuthController.getUser() error: ', err);
      const er = RestErrors.newInternalServerError('Something went wrong');
      res.status(er.status);
      res.json(er);
    }
  }
}

export default AuthController;
