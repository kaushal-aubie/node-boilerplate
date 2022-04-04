import logger, { JetLogger } from 'jet-logger';
import type { Formats, LoggerModes } from 'jet-logger';
import { envVars } from '@/config';

class Logger {
  constructor() {
    JetLogger(
      envVars.logger.JET_LOGGER_MODE as LoggerModes,
      envVars.logger.JET_LOGGER_FILEPATH,
      envVars.logger.JET_LOGGER_TIMESTAMP,
      envVars.logger.JET_LOGGER_FORMAT as Formats
    );
  }

  public static info(...msg: unknown[]): void {
    logger.info(msg);
  }

  public static imp(...msg: unknown[]): void {
    logger.imp(msg);
  }

  public static debug(...msg: unknown[]): void {
    logger.warn(msg, true);
  }

  public static warn(...msg: unknown[]): void {
    logger.warn(msg, true);
  }

  public static err(...msg: unknown[]): void {
    logger.err(msg, true);
  }
}
export default Logger;
