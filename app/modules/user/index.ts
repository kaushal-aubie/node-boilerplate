import { USER_ROUTE_PREFIX } from './user.constants';
import UserRouter from './user.route';

const apiRouter = UserRouter.createRoutes();

const userRoute = { path: USER_ROUTE_PREFIX, router: apiRouter };

export { userRoute };
export * from './user.vm';
