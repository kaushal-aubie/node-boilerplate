import Joi from 'joi';
import type { LanguageMessages } from 'joi';

const objectIdValidate = (value: string, helpers: Joi.CustomHelpers<string>) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id' as unknown as LanguageMessages);
  }
  return value;
};

const passwordValidate = (value: string, helpers: Joi.CustomHelpers<string>) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters' as unknown as LanguageMessages);
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      'password must contain at least 1 letter and 1 number' as unknown as LanguageMessages
    );
  }
  return value;
};

export { objectIdValidate, passwordValidate };
