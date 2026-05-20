import { NextFunction, Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import createHttpError from 'http-errors';
import fs from 'node:fs';
import bookModel from './bookModel';
import { AuthRequest } from '../middlewares/authenticate';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files?.coverImage?.[0] || !files?.file?.[0]) {
        return next(createHttpError(400, "Files are missing"));
    }
   
    const coverImageFile = files.coverImage[0];

      const coverImageMimeType = coverImageFile.mimetype.split('/').at(-1);
    const pdfFile = files.file[0];
    const uploadImageResult = await cloudinary.uploader.upload(coverImageFile.path, {
  
      folder: 'book-cover',
      format: coverImageMimeType,
    });

   

    const uploadFileResult = await cloudinary.uploader.upload(pdfFile.path, {
      resource_type: 'raw',
      // filename_override: BookPdfFileName,
      folder: 'book-pdfs',
    });

    console.log('UploadImageResult:', uploadImageResult);
    console.log('UploadFileResult: ', uploadFileResult);

    const _req = req as AuthRequest;

    // console.log('UserID: ', _req.userId);

    const newBook = await bookModel.create({
      title,
      author: _req.userId,
      genre,
      coverImage: uploadImageResult.secure_url,
      file: uploadFileResult.secure_url,
    });

    try {
      await fs.promises.unlink(coverImageFile.path);
      await fs.promises.unlink(pdfFile.path);
    } catch (error) {
      return next(createHttpError(500, 'Failed to delete Local files'));
    }

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    return next(createHttpError(500, 'Error while uploading files'));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

   let completeCoverImage = book.coverImage;
   
   
if (files?.coverImage?.[0]) {
    const coverFile = files.coverImage[0];
    const uploadResult = await cloudinary.uploader.upload(coverFile.path, { folder: 'book-cover' });
    
    completeCoverImage = uploadResult.secure_url;
    
    const publicId = book.coverImage.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(publicId);

    await fs.promises.unlink(coverFile.path);
}
    let completeFile = book.file;
   
if (files?.file?.[0]) {
    const pdfFile = files.file[0]; 
    
   
    const uploadResult = await cloudinary.uploader.upload(pdfFile.path, { 
        resource_type: 'raw', 
        folder: 'book-pdfs' 
    });
    
    completeFile = uploadResult.secure_url;
       try {
        const bookFileSplit = book.file.split('/');
     
        const publicId = `${bookFileSplit.at(-2)}/${bookFileSplit.at(-1)?.split('.').at(-2)}`;
        
        await cloudinary.uploader.destroy(publicId, {
            resource_type: 'raw', 
        });
    } catch (err) {
        return next(createHttpError(500, 'Failed to delete old file from Cloudinary'));
    }
    try {
        await fs.promises.unlink(pdfFile.path);
    } catch (err) {
        return next(createHttpError(500, 'Failed to delete local temp file'));
    }
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
      },
      { new: true },
    );

    res.json(updatedBook);
  } catch (error) {
    return next(createHttpError(500, 'Failed to update Book'));
  }
};

const listBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _req = req as AuthRequest;
    const books = await bookModel.find({ author: _req.userId });
    res.json(books);
  } catch (error) {
    return next(createHttpError(500, 'Failed to list Books'));
  }
};

const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  const _req = req as AuthRequest;
  try {
    const book = await bookModel.findOne({
      _id: bookId,
      author: _req.userId,
    });
    if (!book) {
      return next(createHttpError(404, 'Book not Found'));
    }

    res.json(book);
  } catch (error) {
    return next(createHttpError(500, 'Failed to get Book'));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  try {
    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, 'Book not Found'));
    }

    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "Unauthorized! You can't delete other books"));
    }

    //  book-cover/hanjrtwpivf0qkw3gqs1

    // https://res.cloudinary.com/duaeme7fm/image/upload/v1777996209/book-cover/hanjrtwpivf0qkw3gqs1.png

    const coverImagesplit = book.coverImage.split('/');

    // console.log("coverImagesplit",coverImagesplit)

    const coverImagePublicId = coverImagesplit.at(-2) + '/' + coverImagesplit.at(-1)?.split('.').at(-2);

    // console.log('coverImagePublicId', coverImagePublicId);

    const bookFileSplit = book.file.split('/');
    // console.log("bookFileSplit:",bookFileSplit)
    const bookFilePublicId = bookFileSplit.at(-2) + '/' + bookFileSplit.at(-1)?.split('.').at(-2);
    //  console.log("bookFilePublicId",bookFilePublicId)
    let deleteItem;
    try {
      await cloudinary.uploader.destroy(coverImagePublicId);
      await cloudinary.uploader.destroy(bookFilePublicId);

      deleteItem = await bookModel.deleteOne({ _id: bookId });
    } catch (error) {
      return next(createHttpError(500, 'Failed to delete Books'));
    }
    res.status(204).json({ deleteItem });
  } catch (error) {
    return next(createHttpError(500, 'Failed to Delete Book'));
  }
};
export { createBook, updateBook, listBook, getSingleBook, deleteBook };
