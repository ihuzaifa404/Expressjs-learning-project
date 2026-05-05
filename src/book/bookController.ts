import { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createHttpError from 'http-errors';
import fs from 'node:fs';
import bookModel from './bookModel';
import { AuthRequest } from '../middlewares/authenticate';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files.coverImage || !files.file || !title || !genre) {
      return next(createHttpError(400, 'All fields are required!.'));
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
    console.log('UploadFileResult: ', uploadFileResult);

    const _req = req as AuthRequest;

    console.log('UserID: ', _req.userId);

    const newBook = await bookModel.create({
      title,
      author: _req.userId,
      genre,
      coverImage: uploadImageResult.secure_url,
      file: uploadFileResult.secure_url,
    });

    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(filePdfPath);
    } catch (error) {
      return next(createHttpError(500, 'Failed to delete Local files'));
    }

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    return next(createHttpError(500, 'Error while uploading files'));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, 'Book Not Found!'));
  }

  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "Unauthorized! You can't update other books"));
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let completeCoverImage = '';
  if (files.coverImage) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);

    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);

    completeCoverImage = fileName;

    const uploadImageResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: 'book-cover',
      format: coverImageMimeType,
    });

    completeCoverImage = uploadImageResult.secure_url;
    await fs.promises.unlink(filePath);
  }
  let completeFile = '';
  if (files.file) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const BookPdfFileName = files.file[0].filename;
    const filePdfPath = path.resolve(__dirname, '../../public/data/uploads', BookPdfFileName);

    completeFile = BookPdfFileName;

    const uploadFileResult = await cloudinary.uploader.upload(filePdfPath, {
      resource_type: 'auto',
      filename_override: completeFile,
      folder: 'book-pdfs',
    });

    completeFile = uploadFileResult.secure_url;
    await fs.promises.unlink(filePdfPath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFile ? completeFile : book.file,
    },{new: true}
  );

  res.json(updatedBook);
};

const listBook=async(req: Request, res: Response, next: NextFunction)=>{

  try {

  const book=await bookModel.find()
    res.json(book)
  } catch (error) {
    return next(createHttpError(404, "Book not Found"))
  }
}

const getSingleBook=async(req: Request, res: Response, next: NextFunction)=>{

console.log("Request aayi hai! ID is:", req.params.bookId);

  const bookId=req.params.bookId;

  try {
    const book=await bookModel.findOne({_id:bookId})

    if (!book) {
      return next(createHttpError(404, "Book not Found"))
    }

    res.json(book)
  } catch (error) {
    return next(createHttpError(500, "Failed to get Book"))
  }

}
export { createBook, updateBook,listBook,getSingleBook };
