import { IResolvers } from '@graphql-tools/utils';
import { inputAndAuthChecker } from '@/middleware';
import userController from './user.controller';
import userValidation from './user.validation';

const userResolver: IResolvers = {
  Query: {
    /**
     ** Get All Users'
     *
     * @validated
     * @Protected
     * @input null
     * @return IGetAllUsersResponse
     */
    getAllUsers: inputAndAuthChecker(userValidation.getAll, userController.getAllUsers),

    /**
     ** Get One User
     *
     * @validated
     * @Protected
     * @input IGetOneUser
     * @return IUser
     */
    getOne: inputAndAuthChecker(userValidation.getOne, userController.getOne),
  },
};
export default userResolver;
