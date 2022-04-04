import Joi from 'joi';
import { password } from './custom.validation';

class AuthValidation {
  register: { body: Joi.ObjectSchema };

  login: { body: Joi.ObjectSchema };

  logout: { body: Joi.ObjectSchema };

  authenticate: { body: Joi.ObjectSchema };

  constructor() {
    this.register = {
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        mobile: Joi.number().required(),
      }),
    };

    this.login = {
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      }),
    };

    this.logout = {
      body: Joi.object().keys({}),
    };

    this.authenticate = {
      body: Joi.object().keys({}),
    };
  }
}

export default new AuthValidation();
