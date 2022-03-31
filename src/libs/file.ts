import fs from 'fs';
import path from 'path';
import { IResultAndError } from '../interfaces/result_and_error';

export const ensureDirectoryExistence = (filePath: string) => {
  try {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    fs.mkdirSync(dirname);
    return true;
  } catch (err) {
    console.log('Error::: ensureDirectoryExistence()', err);
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
          console.log(err);
          reject(err);
        } else {
          console.log(`Output saved to ${pathToFile}`);
          // removeLocalMediaFile(fileName);
          resolve({ result: true, error: err });
        }
      });
    } catch (err) {
      console.log('Error::: SaveToFile()', err);
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
      console.log(pathToFile + fileName);

      fs.appendFile(pathToFile + fileName, data, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(`Output saved to ${pathToFile}`);
          // removeLocalMediaFile(fileName);
          resolve({ result: true, error: err });
        }
      });
    } catch (err) {
      console.log('Error::: CreateAndSaveToFile()', err);
    }
  });
};
export const removeLocalMediaFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      console.log('REMOVING_PATH: ', filePath);
      fs.unlinkSync(filePath);
      return true;
    }
    console.log('PATH:', filePath);
    return false;
  } catch (err) {
    console.log('Error::: removeLocalMediaFile()', err);
    return false;
  }
};
export const moveFile = (src: string, dest: string) => {
  console.log(src, dest);
  return new Promise((resolve, reject) => {
    try {
      fs.copyFile(src, dest, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(`Output moved to ${dest}`);
          resolve({ result: true, error: err });
        }
      });
    } catch (err) {
      console.log('Error::: moveFile()', err);
    }
  });
};
