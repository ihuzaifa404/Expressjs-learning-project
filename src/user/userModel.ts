import mongoose from 'mongoose';
import { User } from '../schemas/user.schema';


const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model<User>('user', userSchema);

export default userModel;
