interface IUser {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email: string | null;
  password: string | null;
  mobile?: string | null;
}
export type { IUser };
