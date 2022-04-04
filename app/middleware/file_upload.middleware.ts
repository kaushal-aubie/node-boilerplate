import path from 'path';
import multer from 'multer';
import type { Field, StorageEngine } from 'multer';
import { FILE_UPLOADS_DIR, storageType, uploadType } from '@/config';
import type { File } from 'app/types';
// import aws from 'aws-sdk';

class Uploader {
  storage!: StorageEngine;

  constructor(type: storageType = storageType.DISK) {
    this.initUploader(type);
  }

  initUploader(type: storageType) {
    switch (type) {
      case storageType.DISK:
        this.storage = this.diskStorage;
        break;

      // case storageType.AWS:
      //   this.storage = this.awsStorage;
      //   break;

      default:
        this.storage = this.diskStorage;
        break;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get diskStorage() {
    return multer.diskStorage({
      destination(_req, _file, cb) {
        cb(null, FILE_UPLOADS_DIR);
      },
      filename: (_req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  // get awsStorage() {
  //   return new aws.S3({
  //     params: {
  //       dirname: '/temp/',
  //       bucket: process.env.AWS_S3_BUCKET_NAME,
  //       secretAccessKey: process.env.AWS_ACCESS_KEY_ID,
  //       accessKeyId: process.env.AWS_SECRET_ACCESS_KEY,
  //       region: process.env.AWS_REGION,
  //       filename: (_req, file, cb) => {
  //         cb(
  //           null,
  //           `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
  //         );
  //       },
  //     },
  //   });
  // }

  public upload(storage: storageType, type: uploadType, ...params: Field[] | string[]) {
    this.initUploader(storage);

    const multerOptions: multer.Options = {
      storage: this.storage,
      fileFilter: (_req, file, cb) => {
        this.checkFileType(file, cb);
      },
      // limits: {
      //   fileSize: 100000,
      // },
    };
    switch (type) {
      case uploadType.SINGLE:
        return multer(multerOptions).single(params[0] as string);

      case uploadType.ARRAY:
        if (params.length > 1) {
          return multer(multerOptions).array(params[0] as string, params[1] as unknown as number);
        }
        return multer(multerOptions).array(params[0] as string);

      case uploadType.FIELDS:
        return multer(multerOptions).fields(params as readonly Field[]);

      case uploadType.NONE:
        return multer(multerOptions).none();

      default:
        return multer(multerOptions).single(params[0] as string);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public checkFileType(file: File, cb: multer.FileFilterCallback) {
    // Allowed ext
    const filetypes =
      /image\/jpg|image\/jpeg|jpeg|txt|text|ppt|pptx|pdf|docx|doc|jpg|png|mp4|xlsx|sheet/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(new Error('File type not allowed') as unknown as null, false);
  }
}

export default new Uploader();
