import {  z } from 'zod';

export const userZodSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least three characters')
  .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters")
  .optional(),
  email: z.string().email('Invalid Email!'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const CreateUserSchema = z.object({
  body: userZodSchema,
});

export const loginUserSchema=z.object({
    body:userZodSchema
})
export type User = z.infer<typeof userZodSchema>;
