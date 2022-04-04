import { Router } from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';

class RootRouter {
  private static apiRouter = Router();

  private static userRouter = userRoute.createRoutes();

  private static authRouter = authRoute.createRoutes();

  // * Accumulate All Routes of Application
  private static allRoutes = [
    {
      path: '/auth',
      route: this.authRouter,
    },
    {
      path: '/user',
      route: this.userRouter,
    },
  ];

  public static createAllRoutes = () => {
    // * Attach all paths and route to main API Router
    this.allRoutes.forEach((route) => {
      this.apiRouter.use(route.path, route.route);
    });

    return this.apiRouter;
  };
}
export default RootRouter;
