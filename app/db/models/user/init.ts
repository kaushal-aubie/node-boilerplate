import { DataTypes } from 'sequelize';
import DB from '../../database';
import { User } from './user.model';

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: new DataTypes.STRING(128),
    },
    lastName: { type: new DataTypes.STRING(128) },
    email: {
      type: new DataTypes.STRING(128),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Email must be in valid format',
        },
      },
    },
    password: { type: new DataTypes.STRING(128) },
    mobile: { type: new DataTypes.STRING(128) },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    timestamps: true,
    underscored: true,
    sequelize: DB.sequelize,
    modelName: 'users',
    // indexes: [{ unique: true, fields: ['firstName', 'email'] }],
    // hooks: {
    //   beforeValidate: (instance: User): HookReturn => {
    //     instance.email = '';
    //   },
    //   afterValidate: (instance: User): HookReturn => {
    //     instance.password = 'Toni';
    //   },
    // },
  }
);

// User.addHook('afterValidate', 'someCustomName', () => {
//   return Promise.reject(new Error("I'm afraid I can't let you do that!"));
// });

export default User;
