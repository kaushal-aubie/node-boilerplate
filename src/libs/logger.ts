import logger from 'jet-logger';

class Logger {
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
