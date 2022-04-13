import Joi from 'joi';
import { ISchema } from '@/interfaces';
import { ValidationUtils } from '@/utils';

class AuthValidation {
  register: ISchema;

  login: ISchema;

  logout: ISchema;

  authenticate: ISchema;

  constructor() {
    this.register = {
      input: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(ValidationUtils.passwordValidate),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        mobile: Joi.number().allow(null),
      }),
    };

    this.login = {
      input: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      }),
    };

    this.logout = {
      input: Joi.object().keys({}),
    };

    this.authenticate = {
      input: Joi.object().keys({}),
    };
  }
}

export default new AuthValidation();
