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
  return next(createHttpError(500,"Error while creating user."))
 }

 
  //hash pasword

  const hashedPassword = await bcrypt.hash(password, 10);

  // console.log(hashPassword)

  let newUser:User

 try {
    newUser = await userModel.create({
     name,
     email,
     password: hashedPassword,
   });
 } catch (error) {
  return next(createHttpError(500,"Error while creating user."))
 }

  //token generation

 try {
   const token = jwt.sign({ sub: newUser._id }, config.jwt as string, {
     expiresIn: '7d',
   });
 
   //response
   res.json({ accessToken: token });
 } catch (error) {
    return next(createHttpError(500,"Error while signing jwt token!"))
 }
};

export { createUser };
