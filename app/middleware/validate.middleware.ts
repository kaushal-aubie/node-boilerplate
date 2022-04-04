import type { NextFunction, Request, Response } from 'express';
import Validator, {
  ValidationError,
  ValidationRuleObject,
  ValidationSchema,
} from 'fastest-validator';
import { ApiErrors } from '@/response_builder';

const v = new Validator();

/**
 * Validate that a resource being POSTed or PUT
 * has a valid shape, else return 400 Bad Request
 * @param {*} resourceSchema is a yup schema
 */

export default class ValidationMiddleware {
  public static isValid =
    (resourceSchema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors: Record<string, any> = {};
      const propertiesToValidate = Object.keys(resourceSchema);

      // throws an error if not valid
      for (const propertyToValidate of propertiesToValidate) {
        const schema: ValidationRuleObject = resourceSchema[propertyToValidate];
        const check = v.compile(schema);
        const validationError = check(req[propertyToValidate as never]) as ValidationError[];

        if (validationError && validationError.length > 0) {
          for (const error of validationError) {
            if (error.type === 'objectStrict') {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              let keys = error.expected.split(',');
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              keys = keys.map((i: string) => i.trim());
              for (const key of keys) {
                const errorIS = validationError.find(
                  (i: ValidationError) => i.field === `user.${key}`
                );
                errors[propertyToValidate] = {
                  ...errors[propertyToValidate],
                  [error.field]: {
                    ...errors[propertyToValidate][error.field],
                    [key]: errorIS,
                  },
                };
              }
            }
            // else if (error.field.includes('.')) {
            // }
            else {
              errors[propertyToValidate] = {
                ...errors[propertyToValidate],
                [error.field]: error,
              };
            }
          }
        }
      }
      if (errors && Object.keys(errors).length > 0) {
        const er = ApiErrors.newBadRequestError('Schema Invalid');
        res.status(er.status);
        res.json(errors);
        return;
      }
      next();
    };
}
