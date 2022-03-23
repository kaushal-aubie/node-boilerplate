import express from 'express'
import AuthController from '../controllers/auth_controller'
import AuthMiddleware from '../middlewares/auth_middleware'

const router = express.Router()

router.post('/signin', AuthController.signin)
router.post('/signup', AuthController.signup)
router.post('/signout', AuthMiddleware.isAuthenticated, AuthController.signout)
router.post(
  '/authenticate',
  AuthMiddleware.isAuthenticated,
  AuthController.getUser
)

export default router
