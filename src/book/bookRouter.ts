import express from 'express';
import { createBook, getSingleBook, listBook, updateBook } from './bookController';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authenticate from '../middlewares/authenticate';

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
  createBook,
);

bookRouter.patch(
  '/update:bookId',
  authenticate,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  updateBook,
);

bookRouter.get('/',listBook)

bookRouter.get('/:bookId',getSingleBook)
export default bookRouter;
