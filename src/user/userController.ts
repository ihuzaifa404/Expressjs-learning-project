import { NextFunction, Request, Response } from 'express';

 const createUser = async (req: Request, res: Response, next: NextFunction) => {

    //validation

    //process

    //response
  res.json({ message: 'Register Successfully!' });
};

export {createUser}

