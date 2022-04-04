import type { IRestError } from '@/response_builder';

export interface IResultAndError<T = unknown> {
  result: T;
  error: null | IRestError;
}
