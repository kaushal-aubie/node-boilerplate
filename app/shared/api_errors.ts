import type { Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

export interface IRestError {
  type: string;
  message: string;
  status: number;
  success: boolean;
}

export default class ApiErrors extends Error {
  public static get types() {
    return {
      INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
      BAD_REQUEST: 'BAD_REQUEST',
      NOT_FOUND: 'NOT_FOUND',
      UNAUTHORIZED: 'UNAUTHORIZED',
    };
  }

  public static newInternalServerError(message: string): IRestError {
    return {
      type: 'INTERNAL_SERVER_ERROR',
      message,
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
    };
  }

  public static newBadRequestError(message: string): IRestError {
    return {
      type: 'BAD_REQUEST',
      message,
      status: HttpStatusCodes.BAD_REQUEST,
      success: false,
    };
  }

  public static newNotFoundError(message: string): IRestError {
    return {
      type: 'NOT_FOUND',
      message,
      status: HttpStatusCodes.NOT_FOUND,
      success: false,
    };
  }

  public static newNotAuthorizedError(message: string): IRestError {
    return {
      type: 'UNAUTHORIZED',
      message,
      status: HttpStatusCodes.UNAUTHORIZED,
      success: false,
    };
  }

  public static sendError(res: Response, error: IRestError) {
    res.status(error.status);
    res.json(error);
    return res;
  }
}
