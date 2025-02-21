/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file: Express.Multer.File, cb) => {
      const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file: Express.Multer.File, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new BadRequestException(
          `Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.`,
        ),
        false,
      );
    }
    cb(null, true);
  },
};
