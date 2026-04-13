import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async () => {
  try {
    
    mongoose.connection.on('connected', () => {
      console.log('Database connected successfully!');
    });

    mongoose.connection.on('error', (err) => {
      console.log('Error in connecting the database!!',err);
    });

    await mongoose.connect(config.dbUrl as string);
  } catch (error) {
    console.error('Failed to connect database', error);
    process.exit(1);
  }
};

export default connectDB;
