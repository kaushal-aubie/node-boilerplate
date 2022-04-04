import { Model } from 'sequelize';
import { IUser } from './user.interface';

export class User extends Model<IUser> {
  declare id: number; // Note that the `null assertion` `!` is required in strict mode.

  declare firstName?: string | null;

  declare lastName?: string | null;

  declare email?: string | null;

  declare password?: string | null; // for nullable fields

  declare mobile?: string | null; // for nullable fields

  // timestamps!
  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}
