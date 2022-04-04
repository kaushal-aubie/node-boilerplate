import commandLineArgs from 'command-line-args';
import dotenv from 'dotenv';
import Validator from 'fastest-validator';
import { ValidationRules } from '@/interfaces';
import { paths } from './paths';

const v = new Validator();

(() => {
  // Setup command line options
  const options = commandLineArgs([
    {
      name: 'env',
      alias: 'e',
      defaultValue: 'development',
      type: String,
    },
  ]);
  // Set the env file
  const result2 = dotenv.config({
    path: `${paths.envPath}/${options.env}.env`,
  });
  if (result2.error) {
    throw result2.error;
  }
})();

const envVarsSchema: ValidationRules = {
  NODE_ENV: { type: 'string', default: 'development' },
  PORT: { type: 'number', default: 5000 },
  COOKIE_SECRET: { type: 'string' },
  COOKIE_EXP: { type: 'string' },
  JWT_EXPIRES_IN: { type: 'string' },

  DB_POR: { type: 'number' },
  DB_NAME: { type: 'string' },
  DB_USER: { type: 'string' },
  DB_DIALECT: { type: 'string' },
  DB_PASSWORD: { type: 'string' },
  DB_HOST: { type: 'string' },
  SMTP_HOST: { type: 'string', optional: true },
  SMTP_PORT: { type: 'string', optional: true },
  SMTP_USERNAME: { type: 'string', optional: true },
  SMTP_PASSWORD: { type: 'string', optional: true },
  EMAIL_FROM: { type: 'string', optional: true },
  JET_LOGGER_TIMESTAMP: { type: 'boolean', default: false },
  JET_LOGGER_MODE: { type: 'string', default: 'CONSOLE' },
  JET_LOGGER_FILEPATH: { type: 'string', default: 'JET_LOGGER_FILEPATH' },
  JET_LOGGER_FORMAT: { type: 'string', default: 'LINE' },
};

const check = v.compile(envVarsSchema);

const envVars = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    dialect: process.env.DB_DIALECT,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    jwtExpireIn: process.env.JWT_EXPIRES_IN,
    cookieExpire: process.env.COOKIE_EXP,
    cookieSecret: process.env.COOKIE_SECRET,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
  logger: {
    JET_LOGGER_TIMESTAMP: process.env.JET_LOGGER_TIMESTAMP,
    JET_LOGGER_MODE: process.env.JET_LOGGER_MODE,
    JET_LOGGER_FILEPATH: process.env.JET_LOGGER_FILEPATH,
    JET_LOGGER_FORMAT: process.env.JET_LOGGER_FORMAT,
  },
};

const isValid = check(envVars);

if (!isValid) {
  throw new Error(`Config validation error: ${isValid}`);
}

export { envVars };
