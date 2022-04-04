import type { IRestError } from '@/shared';

export interface IResultAndError<T = unknown> {
  result: T;
  error: null | IRestError;
}
