import type { IResultAndError } from '@/interfaces';
import { Bcrypt, logger } from '@/libs';
import { User } from '@/models';
import { ApiErrors } from '@/response_builder';
import type { IUserSignupVM } from '../user';

class AuthService {
  /**
   ** Register a user.
   */
  public static register = async (user: IUserSignupVM): Promise<IResultAndError<User | null>> => {
    try {
      logger.info('==> 1:: Checking if user exist with that email or not');
      // Unique user check
      const isExist = await User.findOne({ where: { email: user.email } });
      if (isExist && isExist.id) {
        return {
          result: null,
          error: ApiErrors.newBadRequestError(`User already exist by email ${user.email}`),
        };
      }
      logger.info('==> 2:: User does not exist with that email.');

      /**
       * email id is not registered yet
       * process register
       * encoding password
       */
      const password = await Bcrypt.encode(user.password);
      logger.info('==> 3:: Password encryption done');

      const createRes = await User.create({ ...user, password });
      if (!createRes || !createRes.get('id')) {
        logger.info('==> 4:: User Creation Failed');
        return {
          result: null,
          error: ApiErrors.newInternalServerError('Something went wrong'),
        };
      }
      logger.info('==> 4:: User Created in DB');
      return { result: createRes, error: null };
    } catch (err) {
      logger.err('# Error while registering a user in a AuthService.register()', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };

  /**
   ** login's a user.
   */
  public static login = async (
    email: string,
    password: string
  ): Promise<IResultAndError<User | null>> => {
    try {
      logger.info('==> 1:: Finding User in DB');
      // finding user in db by email id
      const user = await User.findOne({ where: { email } });
      logger.info('==> 2:: User Data Fetched');
      if (!user || !user.id) {
        logger.info('==> 2.1 :: User Is Not Found');
        return {
          result: null,
          error: ApiErrors.newBadRequestError('Invalid credentials'),
        };
      }

      logger.info('==> 3:: Comparing Current Password with user one');
      // comparing password
      const hash = user.get('password');
      if (!hash) {
        logger.info('==> 3.1 :: Hash is undefined/null');
        return {
          result: null,
          error: ApiErrors.newBadRequestError('Something wrong with hash'),
        };
      }
      const isPasswordMatched = await Bcrypt.compare(password, hash);

      logger.info('==> 3.1:: Password Matched Result is', isPasswordMatched);
      if (isPasswordMatched === true) {
        return {
          result: user,
          error: null,
        };
      }
      logger.info('==> 4:: User password does not match');
      const er = ApiErrors.newNotAuthorizedError("Credentials doesn't match");
      return { result: null, error: er };
    } catch (err) {
      logger.err('# Error while login a user in a AuthService.login()', err);
      const er = ApiErrors.newInternalServerError('Something went wrong');
      return { result: null, error: er };
    }
  };
}

export default AuthService;
