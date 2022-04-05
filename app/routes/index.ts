import type { Router } from 'express';
import { IRoutes } from '@/interfaces';
import authRoute from './auth.route';
import userRoute from './user.route';

class RootRouter {
  public static prepareAllRoutes(router: Router) {
    // * get All Module Router and their prefix
    const { router: userRouter, apiPrefix: userPrefix } = userRoute.createRoutes(router);
    const { router: adminRouter, apiPrefix: adminPrefix } = authRoute.createRoutes(router);

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

  public static createAllRoutes = (router: Router) => {
    const allRoutes = this.prepareAllRoutes(router);

    // * Attach all paths and route to main API Router
    allRoutes.forEach((route) => {
      router.use(route.path, route.route);
    });

    return router;
  };
}
export default RootRouter;
