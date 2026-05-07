import { config as conf } from 'dotenv';

conf();
//to make object private use _ not actually private
const _config = {
  port: process.env.PORT,
  dbUrl: process.env.MONGOOSE_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwt: process.env.JWT_SECRET,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  frontenedOrigin: process.env.FRONTENED_ORIGIN,
};

//Object.freeze :> to make the object readonly
export const config = Object.freeze(_config);
