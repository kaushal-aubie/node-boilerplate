import { CustomValidationSchema } from '@/interfaces';

class UserValidation {
  getOne: CustomValidationSchema;

  getAll: CustomValidationSchema;

  constructor() {
    this.getOne = {
      params: {
        id: { type: 'number' },
      },
    };

    this.getAll = {
      body: {},
    };
  }
}

export default new UserValidation();
