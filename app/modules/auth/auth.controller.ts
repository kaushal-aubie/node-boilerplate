import { ApolloError } from 'apollo-server-core';
import { IContext } from '@/interfaces';
import { Jwt, logger } from '@/libs';
import { ApiErrors } from '@/response_builder';
import { TokenUtils } from '@/utils';
import type { IUserSignupVM, IUserVM } from '@/viewModels';
import { UserSignupViewModel, UserViewModel } from '@/viewModels';
import { ILoginRequest, IRegisterRequest } from './auth.types';

class AuthController {
  /**
   ** To get Logged in User Details.
   */
  public static async register(_source: null, { input }: IRegisterRequest, { services }: IContext) {
    try {
      logger.info('CONTROLLER ==> 1:: Inside AuthController.getUser()');
      const user = new UserSignupViewModel(input as IUserSignupVM);
      const registerRes = await services.authService.register(user);
      if (registerRes.error) {
        throw new ApolloError(registerRes.error.message);
      }
      logger.info('CONTROLLER ==> 2:: User Registered Successfully()');
      return { response: registerRes.result };
    } catch (error) {
      logger.err('# ERROR :: Inside AuthController.getUser()', error);
      throw new ApolloError(error as never);
    }
  }

  /**
   ** login's a user.
   */
  public static async login(
    _source: null,
    { input }: ILoginRequest,
    { req, res, services }: IContext
  ) {
    try {
      logger.info('CONTROLLER ==> 1:: Inside AuthController.login()');
      const { email, password } = input;

      const loginRes = await services.authService.login(email, password);
      if (loginRes.error) {
        throw new ApolloError(loginRes.error.message);
      }

      logger.info('CONTROLLER ==> 2:: Login API Successful, User fetched');
      const userVM = new UserViewModel(loginRes.result as unknown as IUserVM);

      // generate jwt token
      const token = Jwt.create({
        user_id: (loginRes.result as unknown as { id: string })?.id,
      });

      if (!token) {
        const er = ApiErrors.newInternalServerError('Something went wrong');
        throw new ApolloError(er.message);
      }
      logger.info('CONTROLLER ==> 3:: JWT Token Generated');
      TokenUtils.setToken(req, res, token);
      return { response: userVM, token };
    } catch (error) {
      logger.err('# ERROR ==> :: Inside AuthController.login()', error);
      throw new ApolloError(error as never);
    }
  }

  /**
   ** To get Logged in User Details.
   */
  public static getUser(_source: unknown, _args: unknown, { user }: IContext) {
    try {
      logger.info('CONTROLLER ==> 1:: Inside AuthController.getUser()');
      if (!user) return null;
      const userVM = new UserViewModel(user as unknown as IUserVM);
      logger.info('CONTROLLER ==> 2:: User found from request');
      return userVM;
    } catch (error) {
      logger.err('# ERROR :: Inside AuthController.getUser()', error);
      throw new ApolloError(error as never);
    }
  }

  /**
   ** logout's a user.
   */
  public static logout(_source: unknown, _args: unknown, { res }: IContext) {
    try {
      TokenUtils.clearToken(res);
      return true;
    } catch (error) {
      logger.err('# ERROR :: Inside AuthController.logout()', error);
      throw new ApolloError(error as never);
    }
  }
}

export default AuthController;
