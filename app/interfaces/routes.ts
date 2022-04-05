import type { Router } from 'express';

export interface IApiRoute {
  router: Router;
  apiPrefix: string;
}

export interface IRoutes {
  path: string;
  route: Router;
}
