import { Model } from 'sequelize';

export class User extends Model {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public firstName!: string | null;

  public lastName!: string | null;

  public email!: string;

  public password!: string | null; // for nullable fields

  public mobile!: string | null; // for nullable fields

  public role!: string;

  // timestamps!
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}
