import { Dialect, Sequelize } from 'sequelize'

const { DB_NAME, DB_USER, DB_DIALECT, DB_PASSWORD, DB_HOST } = process.env

const DB_PORT = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT, 10)
  : undefined

function getDBCredentials() {
  if (!DB_NAME) {
    throw new Error('Database name not found')
  }

  if (!DB_USER) {
    throw new Error('Database user not found')
  }

  if (!DB_PASSWORD) {
    throw new Error('Database password not found')
  }

  if (!DB_HOST) {
    throw new Error('Database host not found')
  }

  if (!DB_PORT) {
    throw new Error('Database port not found')
  }

  if (!DB_DIALECT) {
    throw new Error('Dialect not found')
  }

  return {
    DB_NAME,
    DB_DIALECT,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
  }
}

export default class DB {
  private static _sequelize: Sequelize = DB.newConnection()

  private static newConnection(): Sequelize {
    const dbCredentials = getDBCredentials()
    const seq = new Sequelize(
      dbCredentials.DB_NAME,
      dbCredentials.DB_USER,
      dbCredentials.DB_PASSWORD,
      {
        dialectOptions: {
          multipleStatements: true,
        },
        dialect: dbCredentials.DB_DIALECT as Dialect,
        host: dbCredentials.DB_HOST,
        logging: false,
        port: dbCredentials.DB_PORT,
        pool: {
          max: 50,
          min: 0,
          acquire: 1200000,
          idle: 1000000,
        },
      }
    )
    return seq
  }

  public static init() {
    if (!DB._sequelize) {
      DB._sequelize = DB.newConnection()
    }
  }

  public static get sequelize(): Sequelize {
    return DB._sequelize
  }

  public static async connect() {
    try {
      await DB._sequelize.authenticate()
      console.log('Connection to database has been established successfully.')
    } catch (err) {
      console.error('Unable to connect to the database:', err)
      throw err
    }
  }

  public static async sync() {
    try {
      const result = await DB._sequelize.sync({ alter: false })
      console.log('Database synced successfully.')
      return result
    } catch (err) {
      console.error('Error when trying to sync database:', err)
      throw err
    }
  }
}
