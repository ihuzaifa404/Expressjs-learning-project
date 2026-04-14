import express,  from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';

const app = express();

//Routes

// app.get('/', (req, res, next) => {
  
  
//    res.json({ message: 'Hello this is Product 1' });
  
// });

app.use("/api/users",userRouter)

app.use(globalErrorHandler)

export default app;
