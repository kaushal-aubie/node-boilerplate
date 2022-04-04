import { CustomValidationSchema } from '@/interfaces';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

class AuthValidation {
  register: CustomValidationSchema;

  login: CustomValidationSchema;

  logout: CustomValidationSchema;

  authenticate: CustomValidationSchema;

  constructor() {
    this.register = {
      body: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'email' },
        password: { type: 'string' },
        mobile: { type: 'number', pattern: phoneRegExp, optional: true },
      },
    };

    this.login = {
      body: {
        email: { type: 'email' },
        password: { type: 'string' },
      },
    };

    this.logout = {
      body: {},
    };

    this.authenticate = {
      body: {},
    };
  }
}

export default new AuthValidation();
