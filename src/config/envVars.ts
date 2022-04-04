import commandLineArgs from 'command-line-args';
import dotenv from 'dotenv';
import Joi from 'joi';
import { paths } from './paths';

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

type IEnv = {
  NODE_ENV: string;
  PORT: number;
  COOKIE_SECRET: string;
  COOKIE_EXP: string;
  JWT_EXPIRES_IN: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_DIALECT: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  SMTP_PORT: number;
  SMTP_HOST: string;
  SMTP_USERNAME: string;
  SMTP_PASSWORD: string;
  EMAIL_FROM: string;
  JET_LOGGER_TIMESTAMP: boolean;
  JET_LOGGER_MODE: string;
  JET_LOGGER_FILEPATH: string;
  JET_LOGGER_FORMAT: string;
};

const envVarsSchema = Joi.object<IEnv>()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(5000),
    COOKIE_SECRET: Joi.string().description('Cookie Secret Key').required(),
    COOKIE_EXP: Joi.string().default('').description('Cookie Expire Time').required(),
    JWT_EXPIRES_IN: Joi.string().default('1h').description('JWT Expire Time').required(),

    DB_PORT: Joi.number().description('port to connect to the Database').required(),
    DB_NAME: Joi.string().description('Database Name to connect to the Database').required(),
    DB_USER: Joi.string().description('Database User to connect to the Database').required(),
    DB_DIALECT: Joi.string().description('Dialect to connect to the Database').required(),
    DB_PASSWORD: Joi.string().description('Password to connect to the email server'),
    DB_HOST: Joi.string().description('Host to connect to the Database').required(),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    JET_LOGGER_TIMESTAMP: Joi.boolean().default(false).description('JET_LOGGER_TIMESTAMP'),
    JET_LOGGER_MODE: Joi.string().default('CONSOLE').description('JET_LOGGER_MODE'),
    JET_LOGGER_FILEPATH: Joi.string().description('JET_LOGGER_FILEPATH'),
    JET_LOGGER_FORMAT: Joi.string().default('LINE').description('JET_LOGGER_FORMAT'),
  })
  .unknown();

const { value, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars = {
  env: value.NODE_ENV,
  port: value.PORT,
  db: {
    host: value.DB_HOST,
    name: value.DB_NAME,
    port: value.DB_PORT,
    user: value.DB_USER,
    dialect: value.DB_DIALECT,
    password: value.DB_PASSWORD,
  },
  jwt: {
    jwtExpireIn: value.JWT_EXPIRES_IN,
    cookieExpire: value.COOKIE_EXP,
    cookieSecret: value.COOKIE_SECRET,
  },
  email: {
    smtp: {
      host: value.SMTP_HOST,
      port: value.SMTP_PORT,
      auth: {
        user: value.SMTP_USERNAME,
        pass: value.SMTP_PASSWORD,
      },
    },
    from: value.EMAIL_FROM,
  },
  logger: {
    JET_LOGGER_TIMESTAMP: value.JET_LOGGER_TIMESTAMP,
    JET_LOGGER_MODE: value.JET_LOGGER_MODE,
    JET_LOGGER_FILEPATH: value.JET_LOGGER_FILEPATH,
    JET_LOGGER_FORMAT: value.JET_LOGGER_FORMAT,
  },
};
export { envVars };
