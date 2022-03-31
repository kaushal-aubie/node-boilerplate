import { ErrorMiddleware } from '@/middleware';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import * as Models from '@/models';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV_MODE, paths } from '@/config';
import { DB } from '@/db';
import { logger } from '@/libs';
import { ApiErrors } from '@/shared';
import BaseRouter from '@/routes';
import compression from 'compression';

class App {
  public app: Express;

  public db: typeof DB;

  public port: number | string;

  constructor() {
    // initialize express
    this.app = express();
    this.db = DB;
    this.port = process.env.PORT || 5000;

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  // start express
  public listen() {
    try {
      this.app.listen(this.port, () => {
        logger.imp(`Running in ${process.env.NODE_ENV} mode`);
        logger.imp(`Express server started on port: ${this.port}`);
      });
    } catch (err) {
      logger.err(`Error when starting server ERR:: ${err}`);
    }
  }

  // setup Database Connection
  public setUpDatabase() {
    this.db.init();
    Models.default.setupModelsRelation();
    this.db.sync().catch(logger.err);
    this.db.connect().catch(logger.err);
  }

  // initialize the parsing middleware
  private initializeMiddleware() {
    /*  view engine setup */
    this.app.set('views', paths.templatePath);
    this.app.set('view engine', 'jade');

    // enable cors
    this.app.use(cors());

    this.app.use(cookieParser(process.env.COOKIE_SECRET));

    // parse json request body
    this.app.use(express.json());

    // parse urlencoded request body
    this.app.use(express.urlencoded({ extended: false }));

    // expose static routes
    this.app.use(express.static(paths.publicPath));

    // gzip compression
    this.app.use(compression());

    // Show routes called in console during development
    if (process.env.NODE_ENV === ENV_MODE.DEVELOPMENT) {
      this.app.use(morgan('dev'));
    }

    // Security
    if (process.env.NODE_ENV === ENV_MODE.PRODUCTION) {
      this.app.use(helmet());
    }
  }

  // initialize the error middleware lastly to not override the others
  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

  // initialize the 404 and ping Routes
  private initializeRoutes() {
    this.app.use('/ping', (_req, res) => {
      res.send('pong');
    });

    this.app.use('/v1', BaseRouter);

    /* To handle 404 */
    this.app.use('*', (_req, res) => {
      const notFoundError = ApiErrors.newNotFoundError('Route not found');
      res.json(notFoundError);
    });
  }
}

export default App;
