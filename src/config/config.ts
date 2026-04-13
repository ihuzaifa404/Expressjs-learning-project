import { config as conf } from "dotenv";

conf();
//to make object private use _ not actually private
const _config = {
  port: process.env.PORT,
};

//Object.freeze :> to make the object readonly
export const config = Object.freeze(_config);
