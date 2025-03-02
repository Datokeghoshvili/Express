import express from 'express';
import fs from 'fs';
import productRouter from './routes/productRouter.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config({ path:'./config.env'});
console.log(process.env.DB_USER);
const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development'){

  app.use(morgan('dev'));
}
console.log(process.env.NODE_ENV);
app.use(express.urlencoded({ extended: true }));

// Use the product router correctly
app.use("/products", productRouter);

app.listen(3000, () => {  
  console.log('Server started on http://localhost:3000');
});
