import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v2 as CloudinaryType } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private cloudinary: typeof CloudinaryType,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    folder = 'products',
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image uploads are allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Image must be 5 MB or smaller');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            return reject(new BadRequestException('Image upload failed'));
          }
          resolve(result.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
