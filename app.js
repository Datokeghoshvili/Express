import express from 'express';
import productRouter from './routes/productRouter.js';
import requestInfo from './middlewares/requestInfo.js';
import userRouter from './routes/userRouter.js';
import maintenanse from './middlewares/maintenanse.js';
import { rateLimit } from 'express-rate-limit'

import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config({ path:'./config.env'});
console.log(process.env.DB_USER);
const app = express();
const PORT  = process.env.PORT || 3000;
app.use(express.json());
if (process.env.NODE_ENV === 'development'){

  app.use(morgan('dev'));
  app.use(requestInfo);
}
console.log(process.env.NODE_ENV);
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'production'){ 
  app.use(maintenanse);
  app.use(rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 50, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after an hour'
  }));
}
app.use(maintenanse);
// Use the product router correctly
app.use("/products", productRouter);
app.use("/users", userRouter);


// app.listen(PORT, () => {  
//   console.log('Server started on http://localhost:3000');
// });

export default app;