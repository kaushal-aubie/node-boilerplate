import Knexx, { Knex } from 'knex';
import { Model } from 'objection';
import { logger } from '@/libs';
import { getDBCredentials } from './dbConfig';

export default class DB {
  private static _knex: Knex<any, unknown[]>;

  private static newConnection(): Knex<any, unknown[]> {
    const dbCredentials = getDBCredentials();
    const _knex = Knexx({
      client: 'pg',
      connection: {
        host: dbCredentials.DB_HOST,
        port: dbCredentials.DB_PORT,
        user: dbCredentials.DB_USER,
        password: dbCredentials.DB_PASSWORD,
        database: dbCredentials.DB_NAME,
      },
      pool: {
        max: 50,
        min: 0,
        idleTimeoutMillis: 1000000,
        acquireTimeoutMillis: 1200000,
      },
      dialect: dbCredentials.DB_DIALECT,
    });

    return _knex;
  }

  public static init() {
    if (!DB._knex) {
      DB._knex = DB.newConnection();
    }
  }

  public static get sequelize(): Knex<any, unknown[]> {
    return DB._knex;
  }

  public static connect() {
    try {
      Model.knex(DB._knex);
      logger.imp('Connection to database has been established successfully.');
    } catch (err) {
      logger.err('# Error while connect to the database in DB.connect()', err);
      throw err;
    }
  }

  public static async dropConnection() {
    try {
      await DB._knex.destroy();
      logger.imp('Connection Destroyed successfully.');
    } catch (err) {
      logger.err('# Error while destroying Connection in DB.dopTables()', err);
      throw err;
    }
  }

  // public static async sync(options?: SyncOptions) {
  //   try {
  //     const result = await DB._sequelize.sync(options);
  //     logger.imp('Database synced successfully.');
  //     return result;
  //   } catch (err) {
  //     logger.err('# Error while sync to the database in DB.sync()', err);
  //     throw err;
  //   }
  // }
}
