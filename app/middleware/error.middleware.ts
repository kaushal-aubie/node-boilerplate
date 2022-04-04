/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';
import { logger } from '@/libs';
import { ApiErrors } from '@/response_builder';

function errorMiddleware(
  err: Error | ApiErrors,
  _req: Request,
  _res: Response,
  _next: NextFunction
) {
  logger.err('ERROR Cached in Error Middleware', err, true);
}

export default errorMiddleware;
