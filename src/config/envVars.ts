import { ENV_MODE } from './globals';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || ENV_MODE.DEVELOPMENT;
const { COOKIE_SECRET } = process.env;
const { DB_PORT } = process.env;
const { DB_NAME } = process.env;
const { DB_USER } = process.env;
const { DB_DIALECT } = process.env;
const { DB_PASSWORD } = process.env;
const { DB_HOST } = process.env;
const { JWT_EXPIRES_IN = '1h' } = process.env;
const { COOKIE_EXP = '' } = process.env;

const envVars = {
  COOKIE_SECRET,
  JWT_EXPIRES_IN,
  DB_DIALECT,
  COOKIE_EXP,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  NODE_ENV,
  PORT,
};
export { envVars };
