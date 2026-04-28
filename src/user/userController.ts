import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';
import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken';
import { config } from '../config/config';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //validation

  if (!name ||!email || !password  ) {
    
    const error=createHttpError(400,"All fields are required!")

    return next(error)
  }

  //Database call

  const user= await userModel.findOne({email})

  if(user){

    const error = createHttpError(400, "User already exists")

    return next(error)
  }


  //hash pasword

  const hashedPassword= await bcrypt.hash(password, 10)

  // console.log(hashPassword)

  const newUser = await userModel.create({
    name,
    email,
    password:hashedPassword
  })

  //token generation

  const token = jwt.sign({sub: newUser._id},config.jwt as string , {expiresIn:"7d" })

  //response
  res.json({ accessToken:token });
};

export { createUser };
