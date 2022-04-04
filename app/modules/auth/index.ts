import { AUTH_ROUTE_PREFIX } from './auth.constants';
import apiRouter from './auth.route';

const authRoute = { path: AUTH_ROUTE_PREFIX, route: apiRouter };

export { authRoute };
