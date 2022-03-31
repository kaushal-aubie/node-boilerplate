import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV_MODE, paths } from '@/config';
import { ApiErrors } from '@/shared';

/* importing routes */
import BaseRouter from '@/routes';

const app = express();

/*  view engine setup */
app.set('views', paths.templatePath);
app.set('view engine', 'jade');

/* setup necessary middleware */
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Show routes called in console during development
if (process.env.NODE_ENV === ENV_MODE.DEVELOPMENT) {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === ENV_MODE.PRODUCTION) {
  app.use(helmet());
}

/* expose static routes */
app.use(express.static(paths.publicPath));

// Add APIs

app.use('/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api', BaseRouter);

/* To handle 404 */
app.use('*', (_req, res) => {
  const notFoundError = ApiErrors.newNotFoundError('Route not found');
  res.json(notFoundError);
});

export default app;
