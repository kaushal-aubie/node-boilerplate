import { IResolvers } from '@graphql-tools/utils';
import userController from './user.controller';

const userResolver: IResolvers = {
  Query: {
    /**
     * * Get All Users
     * @input null
     * @return IGetAllUsersResponse
     */
    getAllUsers: userController.getAllUsers,

    /**
     * * Get One User
     * @input IGetOneUser
     * @return IUser
     */
    getOne: userController.getOne,
  },
};
export default userResolver;
