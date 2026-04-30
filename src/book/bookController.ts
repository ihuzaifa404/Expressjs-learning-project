import { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  console.log('files:', files);

  const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: fileName,
    folder: 'book-cover',
    format: coverImageMimeType,
  });

  console.log('UploadResult:', uploadResult);
  res.status(201).json({ message: 'Book created!' });
};

export { createBook };
