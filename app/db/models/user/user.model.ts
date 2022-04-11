import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

// eslint-disable-next-line no-use-before-define
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>; // Note that the `null assertion` `!` is required in strict mode.

  declare firstName: string | null;

  declare lastName: string | null;

  declare email: string | null;

  declare password: string | null; // for nullable fields

  declare mobile: string | null; // for nullable fields

  // timestamps!
  declare readonly createdAt?: CreationOptional<Date>;

  declare readonly updatedAt?: CreationOptional<Date>;

  // getters that are not attributes should be tagged using NonAttribute
  // to remove them from the model's Attribute Typings.
  get fullName(): NonAttribute<string> {
    return [this.firstName, this.lastName].join(' ');
  }
}
