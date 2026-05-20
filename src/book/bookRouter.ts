import express from 'express';
import { createBook, deleteBook, getSingleBook, listBook, updateBook } from './bookController';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authenticate from '../middlewares/authenticate';
import { validate } from '../middlewares/validation';
import { bookIdSchema, createBookSchema, updateBookSchema } from '../schemas/book.schema';

const bookRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'),
  limits: { fileSize: 3e7 },
});

bookRouter.post(
  '/create',
  authenticate,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  validate(createBookSchema),
  createBook,
);

bookRouter.patch(
  '/update/:bookId',
  authenticate,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  validate(updateBookSchema),
  updateBook,
);

bookRouter.get('/',authenticate,listBook)

bookRouter.get('/:bookId',authenticate,validate(bookIdSchema),getSingleBook)

bookRouter.delete("/:bookId",authenticate,validate(bookIdSchema),deleteBook)
export default bookRouter;
