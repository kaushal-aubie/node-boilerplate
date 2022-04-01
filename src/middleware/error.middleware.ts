/* eslint-disable @typescript-eslint/no-unused-vars */
import { logger } from '@/libs';
import { ApiErrors } from '@/shared';
import { NextFunction, Request, Response } from 'express';

function errorMiddleware(
  err: Error | ApiErrors,
  _req: Request,
  _res: Response,
  _next: NextFunction
) {
  logger.err('ERROR Cached in Error Middleware', err, true);
}

export default errorMiddleware;
