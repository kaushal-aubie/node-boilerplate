import { IResultAndError } from '@/interfaces';
import { logger } from '@/libs';
import { User } from '@/models';
import { ApiErrors } from '@/shared';

class UserService {
  public static async getUserById(
    userId: string
  ): Promise<IResultAndError<User | null>> {
    try {
      logger.info('==> 1:: Finding User in DB');
      const user = await User.findOne({ where: { id: userId } });
      if (!user || !user.id) {
        logger.info('==> 2:: User Is Not Found');
        return {
          result: null,
          error: ApiErrors.newBadRequestError('User Not Found'),
        };
      }
      logger.info('==> 2:: User Data Fetched');
      return { result: user, error: null };
    } catch (err) {
      logger.err('UserService.getUserById() ERR: ', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  }

  public static async getAllUsers(): Promise<
    IResultAndError<{
      rows: User[];
      count: number;
    } | null>
  > {
    try {
      logger.info('==> 1:: Fetching Users in DB');
      const user = await User.findAndCountAll();
      if (!user) {
        logger.info('==> 2:: Users Not Found');
        return {
          result: null,
          error: ApiErrors.newBadRequestError('Users Not Found'),
        };
      }
      logger.info('==> 2:: Users Data Fetched');
      return { result: user, error: null };
    } catch (err) {
      logger.err('UserService.getAllUsers() ERR: ', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  }
}

export default UserService;
