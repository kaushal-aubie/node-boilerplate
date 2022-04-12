import { IResolvers } from '@graphql-tools/utils';
import authController from './auth.controller';

const authResolver: IResolvers = {
  Query: {
    /**
     * * Get Logged In Users
     * @input null
     * @return IUser
     */
    getUser: authController.getUser,
  },
  Mutation: {
    /**
     * * Get One User
     * @input ILoginRequest
     * @return ILoginResponse
     */
    login: authController.login,

    /**
     * * Logout's a User
     * @input null
     * @return Boolean
     */
    logout: authController.logout,

    /**
     * * Registers a User
     * @input IRegisterRequest
     * @return IRegisterResponse
     */
    register: authController.register,
  },
};
export default authResolver;
