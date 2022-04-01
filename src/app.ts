import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { envVars, ENV_MODE, paths } from '@/config';
import { DB } from '@/db';
import { logger } from '@/libs';
import { errorMiddleware } from '@/middleware';
import * as Models from '@/models';
import BaseRouter from '@/routes';
import { ApiErrors } from '@/shared';

class App {
  public app: Express;

  public db: typeof DB;

  constructor() {
    // initialize express
    this.app = express();
    this.db = DB;

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  // start express
  public listen() {
    try {
      this.app.listen(envVars.port, () => {
        logger.imp(`Running in ${envVars.env} mode`);
        logger.imp(`Express server started on port: ${envVars.port}`);
      });
    } catch (err) {
      logger.err(`Error when starting server ERR:: ${err}`);
    }
  }

  // setup Database Connection
  public setUpDatabase() {
    this.db.init();
    Models.default.setupModelsRelation();
    this.db.sync({ alter: false }).catch(logger.err);
    this.db.connect().catch(logger.err);
  }

  // initialize the parsing middleware
  private initializeMiddleware() {
    /*  view engine setup */
    this.app.set('views', paths.templatePath);
    this.app.set('view engine', 'jade');

    // enable cors
    this.app.use(cors());

    this.app.use(cookieParser(envVars.jwt.cookieSecret));

    // parse json request body
    this.app.use(express.json());

    // parse urlencoded request body
    this.app.use(express.urlencoded({ extended: false }));

    // expose static routes
    this.app.use(express.static(paths.publicPath));

    // gzip compression
    this.app.use(compression());

    // Show routes called in console during development
    if (envVars.env === ENV_MODE.DEVELOPMENT) {
      this.app.use(morgan('dev'));
    }

    // Security
    if (envVars.env === ENV_MODE.PRODUCTION) {
      this.app.use(helmet());
    }
  }

  // initialize the error middleware lastly to not override the others
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  // initialize the 404 and ping Routes
  private initializeRoutes() {
    this.app.use('/ping', (_req, res) => {
      res.send('pong');
    });

    this.app.use('/v1', BaseRouter);

    // To handle 404
    this.app.use('*', (_req, res) => {
      const notFoundError = ApiErrors.newNotFoundError('Route not found');
      res.json(notFoundError);
    });
  }
}

export default App;
