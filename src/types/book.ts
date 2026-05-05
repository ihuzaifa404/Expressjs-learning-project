import { Types } from "mongoose";
import { User } from "./user";

export interface Book{
    _id:string;
    title:string;
    author:User| Types.ObjectId |string;
    genre:string;
    coverImage:string;
    file:string,
}