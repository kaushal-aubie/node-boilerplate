import type { Dialect, SyncOptions } from 'sequelize';
import { Sequelize } from 'sequelize';
import { logger } from '@/libs';
import { getDBCredentials } from './dbConfig';

export default class DB {
  private static _sequelize: Sequelize = DB.newConnection();

  private static newConnection(): Sequelize {
    const dbCredentials = getDBCredentials();
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
    );
    return seq;
  }

  public static init() {
    if (!DB._sequelize) {
      DB._sequelize = DB.newConnection();
    }
  }

  public static get sequelize(): Sequelize {
    return DB._sequelize;
  }

  public static async connect() {
    try {
      await DB._sequelize.authenticate();
      logger.imp('Connection to database has been established successfully.');
    } catch (err) {
      logger.err('# Error while connect to the database in DB.connect()', err);
      throw err;
    }
  }

  public static async sync(options?: SyncOptions) {
    try {
      const result = await DB._sequelize.sync(options);
      logger.imp('Database synced successfully.');
      return result;
    } catch (err) {
      logger.err('# Error while sync to the database in DB.sync()', err);
      throw err;
    }
  }
}
