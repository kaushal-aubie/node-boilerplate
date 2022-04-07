import { Router } from 'express';
import { IRoutes } from '@/interfaces';
import authRoute from './auth.route';
import userRoute from './user.route';

class RootRouter {
  private static apiRouter: Router = Router();

  public static prepareAllRoutes() {
    // * get All Module Router and their prefix
    const { router: userRouter, apiPrefix: userPrefix } = userRoute.createRoutes();
    const { router: adminRouter, apiPrefix: adminPrefix } = authRoute.createRoutes();

    // * Accumulate All Routes of Application
    const allRoutes: IRoutes[] = [
      {
        path: adminPrefix,
        route: adminRouter,
      },
      {
        path: userPrefix,
        route: userRouter,
      },
    ];

    return allRoutes;
  }

  public static createAllRoutes = () => {
    const allRoutes = this.prepareAllRoutes();

    // * Attach all paths and route to main API Router
    allRoutes.forEach((route) => {
      this.apiRouter.use(route.path, route.route);
    });

    return this.apiRouter;
  };
}
export default RootRouter;
