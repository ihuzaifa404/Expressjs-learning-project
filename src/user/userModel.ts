import mongoose from 'mongoose';
import { User } from '../types/user';

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model<User>('user', userSchema);

export default userModel;
