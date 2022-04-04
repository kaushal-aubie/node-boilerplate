import App from './app';
import { logger } from './libs';

const main = () => {
  // * create new instance of App
  const app = new App();

  // * connect to db
  app.setUpDatabase();

  // * start express
  app.listen();
};

// * Show Logs when error occur
process.on('uncaughtException', (err) => {
  logger.info('+-------------------------------------------------------------+');
  logger.info('# Uncaught Exception in logging from server.ts ');
  logger.err(err);
  logger.info('+-------------------------------------------------------------+');
});

main();
