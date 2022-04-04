import { Router } from 'express';
import { authRoute } from '@/modules/auth';
import { userRoute } from '@/modules/user';

// * Init
const apiRouter = Router();

// * Accumulate All Routes of Application
const allRoutes = [authRoute, userRoute];

// * Attach all paths and route to main API Router
allRoutes.forEach((route) => {
  apiRouter.use(route.path, route.route);
});

export default apiRouter;
