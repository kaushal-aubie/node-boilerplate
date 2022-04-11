import { DataTypes } from 'sequelize';
import DB from '../../database';
import { User } from './user.model';

User.init(
  {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: { type: DataTypes.STRING },
    mobile: { type: DataTypes.STRING },
  },
  {
    timestamps: true,
    underscored: true,
    sequelize: DB.sequelize,
    modelName: 'users',
  }
);

export default User;
