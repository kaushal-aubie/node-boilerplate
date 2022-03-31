import { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';

// Init
const apiRouter = Router();

const allRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
];

allRoutes.forEach((route) => {
  apiRouter.use(route.path, route.route);
});

export default apiRouter;
