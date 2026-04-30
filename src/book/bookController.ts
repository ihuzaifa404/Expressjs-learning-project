import { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createHttpError from 'http-errors';
import fs from "node:fs"
import bookModel from './bookModel';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {title, genre}=req.body
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };


    if (!files.coverImage || !files.file ||!title||!genre) {
        return next(createHttpError(400, "All fields are required!."));
    }
    console.log('files:', files);
  
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
  
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);
  
    const uploadImageResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-cover',
      format: coverImageMimeType,
    });
  
    
    const BookPdfFileName = files.file[0].filename;
    const filePdfPath = path.resolve(__dirname, '../../public/data/uploads', BookPdfFileName);
    
    const uploadFileResult = await cloudinary.uploader.upload(filePdfPath, {
      resource_type: 'auto',
      filename_override: BookPdfFileName,
      folder: 'book-pdfs',
      
    });

    try {
      await fs.promises.unlink(filePath)
      await fs.promises.unlink(filePdfPath)
      
    } catch (error) {
         return next(createHttpError(500, "Failed to delete Local files"));
    }
    
    console.log('UploadImageResult:', uploadImageResult);
    console.log("UploadFileResult: ",uploadFileResult)


    const newBook=await bookModel.create({
      title,
      author:"69f21f1bf44075201f1774c9",
      genre,
      coverImage:uploadImageResult.secure_url,
      file:uploadFileResult.secure_url
    })


    res.status(201).json({ message: 'Book created!' });
  } catch (error) {
    return next(createHttpError(500, "Error while uploading files"));
  }
};

export { createBook };
