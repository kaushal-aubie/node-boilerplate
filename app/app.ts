import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Express, Router } from 'express';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { envVars, ENV_MODE, paths, ROUTE_PREFIX } from '@/config';
import { DB } from '@/db';
import { logger } from '@/libs';
import { errorMiddleware } from '@/middleware';
import * as Models from '@/models';
import { ApiErrors, ApiResponse } from '@/response_builder';
import RootRouter from '@/routes';

class App {
  public app: Express;

  public db: typeof DB;

  public allRoutes: Router;

  public router = express.Router();

  constructor() {
    this.app = express();
    this.db = DB;
    this.allRoutes = RootRouter.createAllRoutes(this.router);

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  // * start express
  public listen() {
    try {
      this.app.listen(envVars.port, () => {
        logger.imp('+-------------------------------------------------------------+');
        logger.imp(`Running in ${envVars.env} mode`);
        logger.imp(`Express server started on port: ${envVars.port}`);
      });
    } catch (err) {
      logger.info('+-------------------------------------------------------------+');
      logger.err('# Error while starting server', err);
      logger.info('+-------------------------------------------------------------+');
    }
  }

  // * setup Database Connection
  public setUpDatabase() {
    try {
      this.db.init();
      Models.default.setupModelsRelation();
      this.db.sync({ alter: false }).catch(logger.err);
      this.db.connect().catch(logger.err);
    } catch (err) {
      logger.info('+-------------------------------------------------------------+');
      logger.err('# Error while setting up Database', err);
      logger.info('+-------------------------------------------------------------+');
    }
  }

  // * initialize the parsing middleware
  private initializeMiddleware() {
    try {
      // * view engine setup
      this.app.set('views', paths.templatePath);
      this.app.set('view engine', 'ejs');

      // * Enable Cross Origin requests
      this.app.use(
        cors({
          origin: ['http://localhost:3000'],
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          allowedHeaders: ['Content-Type', 'Authorization'],
        })
      );

      // * parse json request body
      this.app.use(express.json());

      // * add cookie in request
      this.app.use(cookieParser(envVars.jwt.cookieSecret));

      // * parse urlencoded request body
      this.app.use(express.urlencoded({ extended: false }));

      // * expose static routes
      this.app.use('/public', express.static(paths.publicPath));

      // * Compacting requests using GZIP middleware
      this.app.use(compression());

      // * Show routes called in console during development
      if (envVars.env === ENV_MODE.DEVELOPMENT) {
        // * Requests Logger
        this.app.use(morgan('dev'));
      }

      // * Armoring the API with Helmet
      if (envVars.env === ENV_MODE.PRODUCTION) {
        this.app.use(helmet());
      }
    } catch (err) {
      logger.info('+-------------------------------------------------------------+');
      logger.err('# Error while initializing middlewares', err);
      logger.info('+-------------------------------------------------------------+');
    }
  }

  // * initialize the error middleware lastly to not override the others
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  // * initialize the 404 and ping Routes
  private initializeRoutes() {
    try {
      // * Home route
      this.app.route('/').get((_req, res) => {
        const message = `Server working successfully`;
        const apiRes = ApiResponse.newResponse({ message });
        ApiResponse.sendResponse(res, apiRes);
      });

      // * Ping Route
      this.app.use('/ping', (_req, res) => {
        res.send('pong');
      });

      // * Add Main Route Prefix over all routes
      this.app.use(ROUTE_PREFIX, this.allRoutes);

      // * To handle 404
      this.app.use('*', (req, res) => {
        const message = `Route with METHOD:${req.method} and URL:${req.baseUrl} not found`;
        const err = ApiErrors.newNotFoundError(message);
        ApiErrors.sendError(res, err);
      });
    } catch (err) {
      logger.info('+-------------------------------------------------------------+');
      logger.err('# Error while initializing routes', err);
      logger.info('+-------------------------------------------------------------+');
    }
  }
}

export default App;
