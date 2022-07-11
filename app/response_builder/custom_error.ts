import HttpStatusCodes from 'http-status-codes';
import { apiErrorTypes } from './api_errors';

const errorTypes = {
  [apiErrorTypes.BAD_REQUEST]: {
    type: apiErrorTypes.BAD_REQUEST,
    message: 'BAD_REQUEST ',
    status: HttpStatusCodes.BAD_REQUEST,
    success: false,
  },

  [apiErrorTypes.INPUT_VALIDATION_ERROR]: {
    type: apiErrorTypes.INPUT_VALIDATION_ERROR,
    message: 'INPUT_VALIDATION_ERROR',
    status: HttpStatusCodes.BAD_REQUEST,
    success: false,
  },

  [apiErrorTypes.NOT_FOUND]: {
    type: apiErrorTypes.NOT_FOUND,
    message: 'NOT_FOUND',
    status: HttpStatusCodes.NOT_FOUND,
    success: false,
  },

  [apiErrorTypes.INTERNAL_SERVER_ERROR]: {
    type: apiErrorTypes.INTERNAL_SERVER_ERROR,
    message: 'INTERNAL_SERVER_ERROR',
    status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    success: false,
  },

  [apiErrorTypes.UNAUTHORIZED]: {
    type: apiErrorTypes.UNAUTHORIZED,
    message: 'UNAUTHORIZED',
    status: HttpStatusCodes.UNAUTHORIZED,
    success: false,
  },

  [apiErrorTypes.NOT_AUTHENTICATED]: {
    type: apiErrorTypes.NOT_AUTHENTICATED,
    message: 'NOT_AUTHENTICATED',
    status: HttpStatusCodes.UNAUTHORIZED,
    success: false,
  },
};

export { errorTypes, apiErrorTypes };
