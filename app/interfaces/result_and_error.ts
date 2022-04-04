import type { IApiError } from '@/response_builder';

export interface IResultAndError<T = unknown> {
  result: T;
  error: null | IApiError;
}
