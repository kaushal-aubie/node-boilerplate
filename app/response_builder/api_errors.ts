import type { Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

enum apiErrorTypes {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
}

export interface IRestError {
  type: apiErrorTypes;
  message: string;
  status: number;
  success: boolean;
}

export default class ApiErrors extends Error {
  public static newInternalServerError(message: string): IRestError {
    return {
      type: apiErrorTypes.INTERNAL_SERVER_ERROR,
      message,
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
    };
  }

  public static newBadRequestError(message: string): IRestError {
    return {
      type: apiErrorTypes.BAD_REQUEST,
      message,
      status: HttpStatusCodes.BAD_REQUEST,
      success: false,
    };
  }

  public static newNotFoundError(message: string): IRestError {
    return {
      type: apiErrorTypes.NOT_FOUND,
      message,
      status: HttpStatusCodes.NOT_FOUND,
      success: false,
    };
  }

  public static newNotAuthorizedError(message: string): IRestError {
    return {
      type: apiErrorTypes.UNAUTHORIZED,
      message,
      status: HttpStatusCodes.UNAUTHORIZED,
      success: false,
    };
  }

  public static newNoAccessError(message: string): IRestError {
    return {
      type: apiErrorTypes.NOT_AUTHENTICATED,
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
