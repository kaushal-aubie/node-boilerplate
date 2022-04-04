import fs from 'fs';
import path from 'path';
import type { IResultAndError } from '@/interfaces';
import logger from './logger';

export const ensureDirectoryExistence = (filePath: string) => {
  try {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    fs.mkdirSync(dirname);
    return true;
  } catch (err) {
    logger.err('Error::: ensureDirectoryExistence()', err);
    return false;
  }
};
export const SaveToFile = ({
  pathToFile,
  data,
  fileName,
}: {
  pathToFile: string;
  data: string;
  fileName: string;
}): Promise<IResultAndError> => {
  ensureDirectoryExistence(pathToFile);
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(pathToFile + fileName, data, (err) => {
        if (err) {
          logger.err(err);
          reject(err);
        } else {
          logger.info(`Output saved to ${pathToFile}`);
          // removeLocalMediaFile(fileName);
          resolve({ result: true, error: err });
        }
      });
    } catch (err) {
      logger.err('# Error while saving a file in FileHelper.SaveToFile()', err);
      reject(err);
    }
  });
};
export const CreateAndSaveToFile = ({
  pathToFile,
  data,
  fileName,
}: {
  pathToFile: string;
  data: string;
  fileName: string;
}): Promise<IResultAndError | null> => {
  return new Promise((resolve, reject) => {
    try {
      ensureDirectoryExistence(pathToFile);
      logger.info(pathToFile + fileName);

      fs.appendFile(pathToFile + fileName, data, (err) => {
        if (err) {
          logger.info(err);
          reject(err);
        } else {
          logger.info(`Output saved to ${pathToFile}`);
          // removeLocalMediaFile(fileName);
          resolve({ result: true, error: err });
        }
      });
    } catch (err) {
      logger.err('Error::: CreateAndSaveToFile()', err);
    }
  });
};
export const removeLocalMediaFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      logger.info('REMOVING_PATH: ', filePath);
      fs.unlinkSync(filePath);
      return true;
    }
    logger.info('PATH:', filePath);
    return false;
  } catch (err) {
    logger.err('Error::: removeLocalMediaFile()', err);
    return false;
  }
};
export const moveFile = (src: string, dest: string) => {
  logger.info(src, dest);
  return new Promise((resolve, reject) => {
    try {
      fs.copyFile(src, dest, (err) => {
        if (err) {
          logger.err(err);
          reject(err);
        } else {
          logger.info(`Output moved to ${dest}`);
          resolve({ result: true, error: err });
        }
      });
    } catch (err) {
      logger.err('Error::: moveFile()', err);
    }
  });
};
