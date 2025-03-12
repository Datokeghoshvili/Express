import express from 'express';
const productRouter = express.Router();
import productSlugify from '../middlewares/productSlugify.js'; 
import {
  getProducts,
  getProductsCount,
  getExpensiveProduct,
  getLastAddedProduct,  // ✅ Fixed naming
  createProduct,
  byProduct,
  changeProductById,
  updateProductById,
  deleteProductById,
  deleteAllProduct,
  getCategoryStats


} from '../controllers/productController.js';

productRouter.route('/').get(getProducts).post(productSlugify, createProduct);
productRouter.route('/stats').get(getCategoryStats);
productRouter.route('/count').get(getProductsCount);
productRouter.route('/most-expensive').get(getExpensiveProduct);
productRouter.route('/latest').get(getLastAddedProduct);  
productRouter.route('/by/:_id').post(byProduct).put(changeProductById).patch(updateProductById);
productRouter.route('/:_id').put(updateProductById).delete(deleteProductById);
productRouter.route('/delete-all').delete(deleteAllProduct);

export default productRouter;
