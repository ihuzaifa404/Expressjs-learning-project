import express from 'express';
import { createUser, getUserProfile, loginUser } from './userController';
import authenticate from '../middlewares/authenticate';
import { validate } from '../middlewares/validation';
import { CreateUserSchema, loginUserSchema } from '../schemas/user.schema';

const userRouter = express.Router();

userRouter.post('/register',validate(CreateUserSchema), createUser);
userRouter.post('/login',validate(loginUserSchema), loginUser);
userRouter.get('/profile', authenticate, getUserProfile);

export default userRouter;
