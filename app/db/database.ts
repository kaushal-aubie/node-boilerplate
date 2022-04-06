import { DataSource, EntityTarget, Repository } from 'typeorm';
import { User } from '@/entity';
import { logger } from '@/libs';
import { getDBCredentials } from './dbConfig';

export default class DB {
  private static _dataSource: DataSource = DB.newConnection();

  private static newConnection(): DataSource {
    const dbCredentials = getDBCredentials();
    const seq = new DataSource({
      type: dbCredentials.DB_DIALECT as never,
      host: dbCredentials.DB_HOST,
      port: dbCredentials.DB_PORT,
      username: dbCredentials.DB_USER,
      password: dbCredentials.DB_PASSWORD,
      database: dbCredentials.DB_NAME,
      logging: false,
      synchronize: true,
      entities: [User],
      subscribers: [],
      migrations: [],
    });
    return seq;
  }

  public static init() {
    if (!this._dataSource) {
      this._dataSource = DB.newConnection();
    }
  }

  public static get dataSource(): DataSource {
    return this._dataSource;
  }

  public static async connect(): Promise<void> {
    try {
      await this._dataSource.initialize();
      logger.imp('Connection to database has been established successfully.');
    } catch (err) {
      logger.err('# Error while connect to the database in DB.connect()', err);
      throw err;
    }
  }

  public static get isConnected(): boolean {
    try {
      return this._dataSource.isInitialized;
    } catch (err) {
      logger.err('# Error in DB.isConnected()', err);
      throw err;
    }
  }

  public static async destroy(): Promise<void> {
    try {
      await this._dataSource.destroy();
    } catch (err) {
      logger.err('# Error while disconnecting to the database in DB.destroy()', err);
      throw err;
    }
  }

  public static async dropDatabase(): Promise<void> {
    try {
      await this._dataSource.dropDatabase();
    } catch (err) {
      logger.err('# Error while dropping DB in DB.dropDatabase()', err);
      throw err;
    }
  }

  public static getRepository<T>(target: EntityTarget<T>): Repository<T> {
    try {
      return this._dataSource.getRepository(target);
    } catch (err) {
      logger.err('# Error while dropping DB in DB.dropDatabase()', err);
      throw err;
    }
  }

  public static async sync(dropBeforeSync?: boolean | undefined): Promise<void> {
    try {
      const result = await DB._dataSource.synchronize(dropBeforeSync);
      logger.imp('Database synced successfully.');
      return result;
    } catch (err) {
      logger.err('# Error while sync to the database in DB.sync()', err);
      throw err;
    }
  }
}
