import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

interface AuthRequest extends Request {
  userId: string;
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authentication');

  if (!token) {
    return next(createHttpError(401, 'Authentication Token is required!'));
  }
try {
    
      const parsedToken = token.split(' ')[1];
    
      const decoded = jwt.verify(parsedToken, config.jwt as string);
    
      console.log('decoded', decoded);
    
      const _req = req as AuthRequest;
      _req.userId = decoded.sub as string;
    
      next();
} catch (error) {
    return  next(createHttpError(401, "Token Expired"))
}
};
export default authenticate;
