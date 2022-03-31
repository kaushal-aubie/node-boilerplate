import { DataTypes } from 'sequelize/types';
import { DB } from '../../db';
import { User } from './model';

User.init(
  {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    mobile: DataTypes.STRING,
    role: DataTypes.STRING,
  },
  {
    underscored: true,
    sequelize: DB.sequelize,
    modelName: 'users',
  }
);

interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  mobile?: string;
  role?: string;
}

export { User };
export type { IUser };
