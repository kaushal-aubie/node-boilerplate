import { NextFunction, Request, Response } from 'express'
import AuthHelper from '../helpers/auth_helper'
import User from '../models/user'
import JwtUtil from '../utils/jwt'
import RestErrors from '../utils/rest_errors'

export default class AuthMiddleware {
  public static async isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = AuthHelper.getToken(req)
      if (!token) {
        const er = RestErrors.newNotAuthorizedError('Token not Found')
        res.status(er.status)
        res.json(er)
        return
      }
      const tokenVerificationRes = await JwtUtil.verify(token)
      console.log(
        'AuthMiddleware.isAuthentication() tokenVerificationRes ',
        tokenVerificationRes
      )
      const user = await User.findByPk(tokenVerificationRes.user_id)
      if (!user || !user.id) {
        const er = RestErrors.newNotAuthorizedError('Not authorized')
        res.status(er.status)
        res.json(er)
        return
      }
      // append user data to request object
      ;(req as Request & { user: User }).user = user
      next()
    } catch (err) {
      console.log('AuthMiddleware.isAuthentication() error: ', err)
      const er = RestErrors.newNotAuthorizedError('Not authorized')
      res.status(er.status)
      res.json(er)
      throw new Error('Not authorized')
    }
  }
}
