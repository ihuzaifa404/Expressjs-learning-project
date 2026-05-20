import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import {z, ZodError } from 'zod';


export const validate = <T extends z.ZodTypeAny>(schema: T) => 
    (req: Request, res: Response, next: NextFunction) => {

        try {
            schema.parse({
                body:req.body,
                query:req.query,
                params:req.params
            })
            next()
        } catch (error) {
            if (error instanceof ZodError) {

                const errorMessage=error.issues.map((err)=>
                    `${err.path.join('.')}:${err.message}`
                ).join(',')

                return next(createHttpError(400,errorMessage))
            }
           next(error);
        }
    };
