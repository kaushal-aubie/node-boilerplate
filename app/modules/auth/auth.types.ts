export interface IRegisterRequest {
  input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobile: string | null;
  };
}

export interface ILoginRequest {
  input: {
    email: string;
    password: string;
  };
}
