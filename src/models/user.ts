import { Model, DataTypes } from 'sequelize'
import DB from '../utils/database'

class User extends Model {
  public id!: number // Note that the `null assertion` `!` is required in strict mode.

  public firstName!: string | null

  public lastName!: string | null

  public email!: string

  public password!: string | null // for nullable fields

  public mobile!: string | null // for nullable fields

  public role!: string

  // timestamps!
  public readonly createdAt!: Date

  public readonly updatedAt!: Date
}

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
)

export default User

export interface IUser {
  firstName?: string
  lastName?: string
  email: string
  password: string
  mobile?: string
  role?: string
}
