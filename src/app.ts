import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';

const app = express();

//Routes

app.get('/', (req, res, next) => {
  try {
    const isError = true;
    if (isError) {
      const error = createHttpError(400, 'Something went wrong');
      return next(error);
    }
    res.json({ message: 'Hello this is Product 1' });
  } catch (error) {
    next(error);
  }
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    errorStack: config.env === 'development' ? err.stack : undefined,
  });
});

export default app;
