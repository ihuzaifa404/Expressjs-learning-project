import mongoose from 'mongoose';

import {  IBookSchema } from '../schemas/book.schema';


const bookSchema = new mongoose.Schema<IBookSchema>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
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

const bookModel = mongoose.model<IBookSchema>('book', bookSchema);

export default bookModel;


