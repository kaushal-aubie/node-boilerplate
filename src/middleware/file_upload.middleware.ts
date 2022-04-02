import path from 'path';
import multer, { StorageEngine } from 'multer';
import { FILE_UPLOADS_DIR, storageType, uploadType } from '@/config';
import { File } from 'src/types';

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

      default:
        this.storage = this.diskStorage;
        break;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get diskStorage() {
    return multer.diskStorage({
      destination: FILE_UPLOADS_DIR,
      filename: (_req, file, cb) => {
        cb(
          null,
          `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
        );
      },
    });
  }

  public upload(storage: storageType, type: uploadType, ...params: never[]) {
    this.initUploader(storage);
    switch (type) {
      case uploadType.SINGLE:
        return multer({
          storage: this.storage,
          fileFilter: (_req, file, cb) => {
            this.checkFileType(file, cb);
          },
        }).single(params[0]);

      case uploadType.ARRAY:
        if (params.length > 1) {
          return multer({ storage: this.storage }).array(params[0], params[1]);
        }
        return multer({ storage: this.storage }).array(params[0]);

      case uploadType.FIELDS:
        return multer({ storage: this.storage }).fields(params);

      case uploadType.NONE:
        return multer({ storage: this.storage }).none();

      default:
        return multer({ storage: this.storage }).single(params[0]);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public checkFileType(file: File, cb: multer.FileFilterCallback) {
    // Allowed ext
    const filetypes =
      /image\/jpg|image\/jpeg|jpeg|txt|text|ppt|pptx|pdf|docx|doc|jpg|png|mp4|xlsx|sheet/;
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb('File type not allowed' as unknown as null, false);
  }
}

export default new Uploader();
