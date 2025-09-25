import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { Express } from 'express';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File, name?: string) {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        {
          public_id: name
            ? name.split('.')[0]
            : `${Date.now()}-${file.originalname.split('.')[0]}`,
        },
        (error, result) => {
          if (error) {
            return reject(error as Error);
          }
          if (!result) reject(new Error('result is unknown'));
          resolve(result as UploadApiResponse);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    }).then((data: UploadApiResponse) => data);
  }

  removeFile(fileName: string) {
    return v2.uploader.destroy(fileName);
  }
}
