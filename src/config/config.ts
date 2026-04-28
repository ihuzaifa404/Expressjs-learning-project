import { config as conf } from "dotenv";

conf();
//to make object private use _ not actually private
const _config = {
  port: process.env.PORT,
  dbUrl:process.env.MONGOOSE_CONNECTION_STRING,
  env:process.env.NODE_ENV,
  jwt:process.env.JWT_SECRET
};

//Object.freeze :> to make the object readonly
export const config = Object.freeze(_config);
