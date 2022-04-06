import { DB } from '@/db';
import { logger } from '@/libs';

const main = async () => {
  try {
    await DB.dropDatabase();
    process.exit(0);
  } catch (err) {
    logger.err(err);
    process.exit(1);
  }
};

main().catch(logger.err);
