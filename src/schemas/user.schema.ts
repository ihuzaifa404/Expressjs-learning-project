import { Types } from 'mongoose';
import {  z } from 'zod';


const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId format",
});
export const userZodSchema = z.object({
  _id: objectIdSchema.optional(),
  name: z.string().trim().min(3, 'Name must be at least three characters')
  .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters")
  .optional(),
  email: z.string().email('Invalid Email!').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const CreateUserSchema = z.object({
  body: userZodSchema,
});

export const loginUserSchema=z.object({
    body:userZodSchema
})
export type User = z.infer<typeof userZodSchema>;
