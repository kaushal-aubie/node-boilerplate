import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { logger } from '@/libs';
import { ApiErrors } from '@/response_builder';
import { Pick } from '@/utils';

type ISchema = {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
};

class ValidateMiddleware {
  /**
   * Validates the Body, Params, Query with the Schema
   * @param {ISchema} schema
   */
  public static validate =
    (schema: ISchema) => (req: Request, res: Response, next: NextFunction) => {
      try {
        const validSchema = Pick(schema, ['params', 'query', 'body']);
        const object = Pick(req, Object.keys(validSchema));
        const { error, value } = Joi.compile(validSchema)
          .prefs({ errors: { label: 'key' }, abortEarly: false })
          .validate(object);

        if (error) {
          const errorMessage = error.details.map((details) => details.message).join(', ');
          const er = ApiErrors.newBadRequestError(errorMessage);
          ApiErrors.sendError(res, er);
          return;
        }
        Object.assign(req, value);
        next();
      } catch (err) {
        logger.err('# Error while validating in ValidateMiddleware.validate()', err);
        const er = ApiErrors.newInternalServerError('Something went wrong during Validation');
        ApiErrors.sendError(res, er);
      }
    };
}

export default ValidateMiddleware.validate;
