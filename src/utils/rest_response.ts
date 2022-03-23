export interface IRestResponse<T = unknown, U = unknown> {
  type: string
  data: T
  status: number
  success: boolean
  message?: string
  moreInfo?: U
}

interface INewResponseParams<T = unknown, U = unknown> {
  type?: string
  data?: T
  message?: string
  status?: number
  moreInfo?: U
}

export default class RestResponse {
  public static newResponse({
    type,
    data,
    message,
    status,
    moreInfo,
  }: INewResponseParams): IRestResponse {
    const r: IRestResponse = {
      type: type || 'ok_response', // String
      data, // Mixed/Object | not present if undefined
      status: status || 200, // Int
      success: true,
    }

    if (message) {
      r.message = message
    }

    if (moreInfo) {
      r.moreInfo = moreInfo
    }

    return r
  }
}
