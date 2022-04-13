import { IResolvers } from '@graphql-tools/utils';
import { authMiddleware, validate } from '@/middleware';
import authController from './auth.controller';
import authValidation from './auth.validation';

const { isAuthenticated } = authMiddleware;
const authResolver: IResolvers = {
  Query: {
    /**
     ** Get Logged In Users
     * @Protected
     * @input null
     * @return IUser
     */
    getUser: isAuthenticated(authController.getUser),
  },
  Mutation: {
    /**
     ** Get One User
     * @validated
     * @Protected
     * @input ILoginRequest
     * @return ILoginResponse
     */
    login: validate(authValidation.login, authController.login),

    /**
     * * Logout's a User
     * @input null
     * @return Boolean
     */
    logout: authController.logout,

    /**
     ** Registers a User
     * @validated
     * @input IRegisterRequest
     * @return IRegisterResponse
     */
    register: validate(authValidation.register, authController.register),
  },
};
export default authResolver;
