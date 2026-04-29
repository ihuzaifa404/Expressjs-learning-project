import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../types/user';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //validation

  if (!name || !email || !password) {
    const error = createHttpError(400, 'All fields are required!');

    return next(error);
  }

  //Database call

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, 'User already exists');
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, 'Error while creating user.'));
  }


  const hashedPassword = await bcrypt.hash(password, 10);


  let newUser: User;

  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, 'Error while creating user.'));
  }

  //token generation

  try {
    const token = jwt.sign({ sub: newUser._id }, config.jwt as string, {
      expiresIn: '7d',
    });

    res.status(201).json({ accessToken: token });

  } catch (error) {
    return next(createHttpError(500, 'Error while signing jwt token!'));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  let { email, password } = req.body;

  if (!email || !password) {
    const error = createHttpError(400, 'All fields are required!');
    return next(error);
  }

let user;

  try {
     user = await userModel.findOne({ email });

    if (!user) {

      return next(createHttpError(404, 'User not found'));
    }
  } catch (error) {

    return next(createHttpError(500, 'Error while Login'));
  }

  const isMatched = await bcrypt.compare(password, user.password)

  if(!isMatched){
    return next(createHttpError(401,"Error! email or password is incorrect"))
  }


try {
  const token = jwt.sign({ sub: user._id }, config.jwt as string, {
      expiresIn: '7d',
    });
    res.status(200).json({ accessToken:token });
    
} catch (error) {
  
    return next(createHttpError(500, 'Error while signing jwt token!'));
}
};

export { createUser, loginUser };
