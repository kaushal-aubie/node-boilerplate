import HttpStatusCodes from 'http-status-codes';
import { WithRequired } from 'src/types';

interface IRestResponse<T = unknown, U = unknown> {
  type?: string;
  data?: T;
  message?: string;
  status?: number;
  moreInfo?: U;
}

export default class RestResponse {
  public static newResponse({
    type,
    data,
    message,
    status,
    moreInfo,
  }: IRestResponse): WithRequired<IRestResponse, 'status'> {
    const r: WithRequired<IRestResponse, 'status'> = {
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
