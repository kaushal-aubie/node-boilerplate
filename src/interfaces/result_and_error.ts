import { IRestError } from '../shared/rest_errors';

export interface IResultAndError<T = unknown> {
  result: T;
  error: null | IRestError;
}
