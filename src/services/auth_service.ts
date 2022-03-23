import { IUserSignupVM } from '@viewmodels/user_vm'
import { IResultAndError } from '../interfaces/result_and_error'
import User from '../models/user'
import PasswordEncoder from '../utils/password_encoder'
import RestErrors from '../utils/rest_errors'

class AuthService {
  public static async signup(user: IUserSignupVM): Promise<IResultAndError> {
    try {
      console.log('==> 1:: Checking is user exist with that email or not')
      // Unique user check
      const isExist = await User.findOne({ where: { email: user.email } })
      if (isExist && isExist.id) {
        return {
          result: null,
          error: RestErrors.newBadRequestError(
            `User already exist by email ${user.email}`
          ),
        }
      }
      console.log('==> 2:: User does not exist with that email.')

      /**
       * email id is not registered yet
       * process signup
       * encoding password
       */
      const password = await PasswordEncoder.encode(user.password)
      console.log('==> 3:: Password is encryped')

      const createRes = await User.create({ ...user, password })
      if (!createRes || !createRes.get('id')) {
        console.log('==> 4:: User Creation Failed')
        return {
          result: null,
          error: RestErrors.newinternalServerError('Something went wrong'),
        }
      }
      console.log('==> 4:: User Created in DB')
      return { result: createRes, error: null }
    } catch (err) {
      console.error('AuthService.signup() error: ', err)
      const er = RestErrors.newinternalServerError('Something went wrong')
      return { result: null, error: er }
    }
  }

  public static async signin(
    email: string,
    password: string
  ): Promise<IResultAndError> {
    try {
      console.log('==> 1:: Finding User in DB')
      // finding user in db by email id
      const user = await User.findOne({ where: { email } })
      console.log('==> 2:: User Data Fetched')
      if (!user || !user.id) {
        console.log('==> 2.1 :: User Is Not Found')
        return {
          result: null,
          error: RestErrors.newBadRequestError('Invalid credentials'),
        }
      }

      console.log('==> 3:: Comparing Current Password with user one')
      // comparing password
      const hash = user.get('password')
      if (!hash) {
        console.log('==> 3.1 :: Hash is undefined/null')
        return {
          result: null,
          error: RestErrors.newBadRequestError('Something wrong with hash'),
        }
      }
      const isPasswordMatched = await PasswordEncoder.compare(password, hash)

      console.log('==> 3.1:: Password Matched Result is ', isPasswordMatched)
      if (isPasswordMatched === true) {
        return {
          result: user,
          error: null,
        }
      }
      console.log('==> 4:: User password does not match')
      const er = RestErrors.newNotAuthorizedError("Credentials dosen't match")
      return { result: null, error: er }
    } catch (err) {
      console.error('AuthService.signin() error: ', err)
      const er = RestErrors.newinternalServerError('Something went wrong')
      return { result: null, error: er }
    }
  }
}

export default AuthService
