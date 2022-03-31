import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

/* importing routes */
import BaseRouter from './routes';
import RestErrors from './shared/rest_errors';

const app = express();

/*  view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/* setup necessary middleware */
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

/* expose static routes */
const staticDir = path.join(__dirname, 'public');
app.use(staticDir);

// Add APIs

app.use('/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api', BaseRouter);

/* To handle 404 */
app.use('*', (_req, res) => {
  const notFoundError = RestErrors.newNotFoundError('Route not found');
  res.json(notFoundError);
});

export default app;
