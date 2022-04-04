export interface IUserVM {
  id: string;
  email: string;
  firstName: string;
  mobile: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

export interface IUserSignupVM {
  firstName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  email: string;
  password: string;
  role: string;
}

class UserViewModel {
  public id: string;

  public email: string;

  public firstName: string;

  public mobile: string;

  public lastName: string;

  public createdAt: Date;

  public updatedAt: Date;

  public role: string;

  constructor(user: IUserVM) {
    this.id = user.id;
    this.email = user.email;
    this.mobile = user.mobile;
    this.firstName = user.firstName;
    this.role = user.role;
    this.lastName = user.lastName;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

class UserSignupViewModel implements IUserSignupVM {
  public email: string;

  public firstName: string | null;

  public lastName: string | null;

  public mobile: string | null;

  public password: string;

  public role: string;

  constructor(user: IUserSignupVM) {
    this.email = user.email;
    this.firstName = user.firstName || null;
    this.lastName = user.lastName || null;
    this.mobile = user.mobile || null;
    this.password = user.password;
    this.role = user.role || 'User'; // Default role is 'User';
  }
}

export { UserSignupViewModel, UserViewModel };
