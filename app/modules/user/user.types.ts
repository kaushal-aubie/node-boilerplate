export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  mobile: string | null;
}

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string | null;
}

export interface IGetAllUsersResponse {
  rows: IUser[];
  count: number;
}

export interface IGetOneRequest {
  input: { id: string };
}
