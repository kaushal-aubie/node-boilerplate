import { Router } from 'express';
import authRouter from './auth';

// Init
const apiRouter = Router();

// Auth Routes

apiRouter.use('/auth', authRouter);

// Export default
export default apiRouter;
