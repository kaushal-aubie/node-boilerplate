import { USER_ROUTE_PREFIX } from './user.constants';
import apiRouter from './user.route';

const userRoute = { path: USER_ROUTE_PREFIX, route: apiRouter };

export * from './user.vm';
export { userRoute };
