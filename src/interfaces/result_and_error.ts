import { IRestError } from '../utils/rest_errors'

export interface IResultAndError<T = unknown> {
  result: T
  error: null | IRestError
}
