import mongoose from 'mongoose';
import { Book } from '../types/book';

const bookSchema = new mongoose.Schema<Book>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const bookModel = mongoose.model<Book>('book', bookSchema);

export default bookModel;

// type: mongoose.Schema.Types.ObjectId,
