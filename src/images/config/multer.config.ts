import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
