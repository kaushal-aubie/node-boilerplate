import { ApolloError } from 'apollo-server-core';
import Joi from 'joi';
import { IContext, ISchema } from '@/interfaces';
import { logger } from '@/libs';
import { ApiErrors, apiErrorTypes } from '@/response_builder';
import { Pick } from '@/utils';

class ValidateMiddleware {
  /**
   * Validates the Body, Params, Query with the Schema
   * @param {ISchema} schema
   */
  public static validate =
    <T, U, V>(schema: ISchema, next: (_parent: T, _args: U, context: IContext) => V) =>
    (_parent: T, _args: U, context: IContext): V => {
      try {
        logger.info('VALIDATE ==> Validating a input');
        const validSchema = Pick(schema, ['input']);
        const object = Pick(_args, Object.keys(validSchema));
        const { error, value } = Joi.compile(validSchema)
          .prefs({ errors: { label: 'key' }, abortEarly: false })
          .validate(object);

        if (error) {
          logger.info(error);
          // const errorMessage = error.details.map((details) => details.message).join(', ');
          throw new ApolloError(apiErrorTypes.INPUT_VALIDATION_ERROR);
        }
        Object.assign(context.req, value);
        return next(_parent, _args, context);
      } catch (err) {
        logger.err('# Error while validating in ValidateMiddleware.validate()', err);
        const er = ApiErrors.newInternalServerError('Something went wrong during Validation');
        throw new ApolloError(er.message);
      }
    };
}

export default ValidateMiddleware.validate;
