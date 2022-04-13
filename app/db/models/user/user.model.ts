import { Model, snakeCaseMappers } from 'objection';

class User extends Model {
  declare id: number; // Note that the `null assertion` `!` is required in strict mode.

  declare firstName: string | null;

  declare lastName: string | null;

  declare email: string | null;

  declare password: string | null; // for nullable fields

  declare mobile: string | null; // for nullable fields

  // timestamps!
  declare readonly createdAt?: Date;

  declare readonly updatedAt?: Date;

  static tableName = 'users';

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'password'],

    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
  };
}

export default User;
