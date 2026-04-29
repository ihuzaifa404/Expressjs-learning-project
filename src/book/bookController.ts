import { NextFunction, Request, Response } from 'express';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log('files:', req.files);

  res.status(201).json({ message: 'Book created!' });
};



export { createBook };
