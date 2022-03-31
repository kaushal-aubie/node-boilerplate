import HttpStatusCodes from 'http-status-codes';
import { WithRequired } from 'src/types';

export interface IApiResponse<T = unknown, U = unknown> {
  type?: string;
  data?: T;
  message?: string;
  status?: number;
  moreInfo?: U;
}

export default class ApiResponse {
  public static newResponse({
    type,
    data,
    message,
    status,
    moreInfo,
  }: IApiResponse): WithRequired<IApiResponse, 'status'> {
    const r: WithRequired<IApiResponse, 'status'> = {
      type: type || 'OK_RESPONSE',
      data,
      status: status || HttpStatusCodes.OK,
    };

    if (message) {
      r.message = message;
    }

    if (moreInfo) {
      r.moreInfo = moreInfo;
    }

    return r;
  }
}
