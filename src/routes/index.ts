import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';

// Init
const apiRouter = Router();

// All Routes
apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);

// Export default
export default apiRouter;
