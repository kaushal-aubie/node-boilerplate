import type { Request, Response } from 'express';
import { emailSender, Jwt, logger } from '@/libs';
import type { IEmailOptions } from '@/libs';
import { IUser } from '@/models';
import { ApiErrors, ApiResponse } from '@/response_builder';
import { TokenUtils } from '@/utils';
import type { IUserSignupVM, IUserVM } from '../user';
import { UserSignupViewModel, UserViewModel } from '../user';
import authService from './auth.service';

class AuthController {
  /**
   ** POST /register
   ** Register a user.
   */

  public static register = async (req: Request, res: Response) => {
    try {
      const user = new UserSignupViewModel(req.body as IUserSignupVM);

      // user signup call
      const registerRes = await authService.register(user);

      // send a email to new user
      const emailOptions: IEmailOptions = {
        subject: 'Welcome',
        html: `<h1>Welcome to boilerplate ${user.firstName}</h1>`,
      };
      emailSender.sendMail(emailOptions).catch(logger.err);
      if (registerRes.error) {
        ApiErrors.sendError(res, registerRes.error);
        return;
      }

      // crating a response object
      const userVM = new UserViewModel(registerRes.result as unknown as IUserVM);
      const r = ApiResponse.newResponse({
        data: userVM,
        message: 'User has Registered successfully',
      });
      ApiResponse.sendResponse(res, r);
    } catch (err) {
      logger.err('# Error while register user in AuthController.register()', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.sendError(res, er);
    }
  };

  /**
   ** POST /login
   ** login's a user.
   */
  public static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as IUser;

      const loginRes = await authService.login(email as string, password as string);
      if (loginRes.error) {
        ApiErrors.sendError(res, loginRes.error);
        return;
      }

      const userVM = new UserViewModel(loginRes.result as unknown as IUserVM);

      // generate jwt token
      const token = Jwt.create({
        user_id: (loginRes.result as unknown as { id: string })?.id,
      });
      if (!token) {
        const er = ApiErrors.newInternalServerError('Something went wrong');
        ApiErrors.sendError(res, er);
        return;
      }
      logger.info('Token generated successfully');
      res = TokenUtils.setToken(req, res, token);
      const r = ApiResponse.newResponse({
        data: { response: userVM, token },
        message: 'User has logged in successfully',
      });
      ApiResponse.sendResponse(res, r);
    } catch (err) {
      logger.err('# Error while login user in AuthController.login()', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.sendError(res, er);
    }
  };

  /**
   ** POST /logout
   ** logout's a user.
   */
  public static logout = (_req: Request, res: Response) => {
    try {
      res = TokenUtils.clearToken(res);
      const r = ApiResponse.newResponse({
        message: 'User has logout successfully',
      });
      ApiResponse.sendResponse(res, r);
    } catch (err) {
      logger.err('# Error while logout user in AuthController.logout()', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.sendError(res, er);
    }
  };

  /**
   ** get /authenticate
   ** To get Logged in User Details.
   */
  public static getUser = (req: Request, res: Response) => {
    try {
      const userVM = new UserViewModel((req as Request & { user: IUserVM }).user);
      const r = ApiResponse.newResponse({
        data: userVM,
        message: 'Signed in user',
      });
      ApiResponse.sendResponse(res, r);
    } catch (err) {
      logger.err('# Error while getting user in AuthController.getUser()', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      ApiErrors.sendError(res, er);
    }
  };
}

export default AuthController;
