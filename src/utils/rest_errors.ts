import { Response } from 'express'

export interface IRestError {
  type: string
  message: string
  status: number
  success: boolean
}

export default class RestErrors {
  public static get types() {
    return {
      internal_server_error: 'internal_server_error',
      bad_request: 'bad_request',
      not_found: 'not_found',
      not_authorized: 'not_authorized',
    }
  }

  public static newinternalServerError(message: string): IRestError {
    return {
      type: 'internal_server_error',
      message,
      status: 500,
      success: false,
    }
  }

  public static newBadRequestError(message: string): IRestError {
    return {
      type: 'bad_request',
      message,
      status: 400,
      success: false,
    }
  }

  public static newNotFoundError(message: string): IRestError {
    return {
      type: 'not_found',
      message,
      status: 404,
      success: false,
    }
  }

  public static newNotAuthorizedError(message: string): IRestError {
    return {
      type: 'not_authorized',
      message,
      status: 403,
      success: false,
    }
  }

  public static sendError(res: Response, error: IRestError) {
    res.status(error.status)
    res.json(error)
    return res
  }
}
