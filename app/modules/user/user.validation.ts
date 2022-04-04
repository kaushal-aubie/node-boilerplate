import Joi from 'joi';

class UserValidation {
  getOne: { params: Joi.ObjectSchema };

  getAll: { body: Joi.ObjectSchema };

  constructor() {
    this.getOne = {
      params: Joi.object().keys({
        id: Joi.number().required(),
      }),
    };

    this.getAll = {
      body: Joi.object().keys({}),
    };
  }
}

export default new UserValidation();
