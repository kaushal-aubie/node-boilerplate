import './pre-start'; // Must be the first import
import server from './server';
import * as Models from './models';
import { DB } from './db';

// Constants
const serverStartMsg = 'Express server started on port: ';
const port = process.env.PORT || 3000;

const setUpDatabase = () => {
  DB.init();
  Models.default.setupModelsRelation();
  DB.sync().catch(console.error);
  DB.connect().catch(console.error);
};

/**
 * Main Startup Function
 */
function main() {
  try {
    const callBack = (err: unknown) => {
      if (err) {
        console.log('Error when starting server ', err);
      } else {
        console.log(serverStartMsg, port);
      }
    };
    setUpDatabase();
    server.listen(port, callBack as () => void);
  } catch (err) {
    console.log('Error when starting server ', err);
  }
}
/* Starting server */
main();
