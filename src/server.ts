import './pre-start'; // Must be the first import
import * as Models from '@/models';
import { DB } from '@/db';
import { logger } from '@/libs';
import server from './main';
import { ENV_MODE } from './config';

// Constants
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || ENV_MODE.DEVELOPMENT;

const setUpDatabase = () => {
  DB.init();
  Models.default.setupModelsRelation();
  DB.sync().catch(logger.err);
  DB.connect().catch(logger.err);
};
/**
 * Main Startup Function
 */
function main() {
  try {
    const callBack = (err: unknown) => {
      if (err) {
        logger.err(`Error when starting server ERR:: ${err}`);
        logger.imp(`Running in ${nodeEnv} mode`);
      } else {
        logger.info(`Express server started on port: ${port}`);
      }
    };
    setUpDatabase();
    server.listen(port, callBack as () => void);
  } catch (err) {
    logger.err(`Error when starting server ERR:: ${err}`);
  }
}
/* Starting server */
main();
