import { Types } from 'mongoose'
import {z} from 'zod'

const checkObjectId=z.string().refine((val)=>Types.ObjectId.isValid(val),{
    message:"Invalid author Id"
})

const bookZodSchema=z.object({
        title:z.string().trim().min(3,"Title is too short"),
        genre:z.string().trim().min(3,"Genre is too short"),
})


export const createBookSchema=z.object({
    body:bookZodSchema
})
export const bookIdSchema = z.object({
    params: z.object({
        bookId: checkObjectId 
    })
});
export const updateBookSchema=z.object({
    body:bookZodSchema.partial(),
    params:z.object({
        bookId:checkObjectId
    })
})


export type Book = z.infer<typeof bookZodSchema> & {
    author: string;
    coverImage: string;
    file: string;
};


export interface IBookSchema extends Omit<Book, 'author'> {
    author: Types.ObjectId; 
}