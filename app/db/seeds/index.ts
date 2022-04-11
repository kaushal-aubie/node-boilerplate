import { DB } from '@/db';
import { logger } from '@/libs';
import UserFactory from '@/modules/user/user.seed';

const main = async () => {
  try {
    DB.init();
    logger.info('1 :: DB Initialized');

    await DB.sync({ force: true });
    logger.info('2 :: DB Sync Completed');

    await DB.connect().catch(logger.err);
    logger.info('3 :: DB Connection Successful');

    logger.info('4 :: Seed Generation Process Started');

    // generate seeds
    const user = await UserFactory().catch(logger.err);
    logger.info('5 :: User Seed Generation Completed', user);
  } catch (err) {
    logger.err('# Error while generating a Seed()', err);
  }
};

main().catch(logger.err);
