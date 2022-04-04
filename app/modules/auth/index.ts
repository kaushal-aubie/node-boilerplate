import { AUTH_ROUTE_PREFIX } from './auth.constants';
import AuthRouter from './auth.route';

const apiRouter = AuthRouter.createRoutes();

const authRoute = { path: AUTH_ROUTE_PREFIX, router: apiRouter };

export { authRoute };
