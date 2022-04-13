import { IContext, ISchema } from '@/interfaces';
import authMiddleware from './auth.middleware';
import validate from './validate.middleware';

const { isAuthenticated } = authMiddleware;

export const inputAndAuthChecker = <T, U, V>(
  schema: ISchema,
  next: (_parent: T, _args: U, context: IContext) => V
) => isAuthenticated(validate(schema, next));
