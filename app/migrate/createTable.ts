import { DB } from '@/db';
import { logger } from '@/libs';

const main = async () => {
  try {
    await DB.connect();
    const { queryRunner } = DB;
    await queryRunner.createDatabase('myDb');
    await queryRunner.dropDatabase('myDb');
    process.exit(0);
  } catch (err) {
    logger.err(err);
    process.exit(1);
  }
};

main().catch(logger.err);
