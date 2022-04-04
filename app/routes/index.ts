import { Router } from 'express';
import { authRoute } from '@/modules/auth';
import { userRoute } from '@/modules/user';

// Init
const apiRouter = Router();

const allRoutes = [authRoute, userRoute];

allRoutes.forEach((route) => {
  apiRouter.use(route.path, route.route);
});

export default apiRouter;
