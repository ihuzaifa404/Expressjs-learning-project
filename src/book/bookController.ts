import { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createHttpError from 'http-errors';
import fs from "node:fs"
import bookModel from './bookModel';
import  { AuthRequest } from '../middlewares/authenticate'

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
    
    console.log('UploadImageResult:', uploadImageResult);
    console.log("UploadFileResult: ",uploadFileResult)

    // @ts-ignore
    console.log("UserID: ",req.userId )
    
    const _req=req as AuthRequest


    const newBook=await bookModel.create({
      title,
      author:_req.userId,
      genre,
      coverImage:uploadImageResult.secure_url,
      file:uploadFileResult.secure_url
    })
    
    
        try {
          await fs.promises.unlink(filePath)
          await fs.promises.unlink(filePdfPath)
          
        } catch (error) {
             return next(createHttpError(500, "Failed to delete Local files"));
        }
    
    res.status(201).json({ id:newBook._id});
  } catch (error) {
    return next(createHttpError(500, "Error while uploading files"));
  }
};

export { createBook };
