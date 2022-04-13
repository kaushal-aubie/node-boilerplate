import Joi from 'joi';
import { ISchema } from '@/interfaces';

class UserValidation {
  getOne: ISchema;

  getAll: ISchema;

  constructor() {
    this.getOne = {
      input: Joi.object().keys({
        id: Joi.number().required(),
      }),
    };

    this.getAll = {
      input: Joi.object().keys({}),
    };
  }
}

export default new UserValidation();
