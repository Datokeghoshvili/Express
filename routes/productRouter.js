import express from 'express';
const productRouter = express.Router();
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
  deleteAllProduct
} from '../controllers/productController.js';

productRouter.route('/').get(getProducts).post(createProduct);
productRouter.route('/count').get(getProductsCount);
productRouter.route('/most-expensive').get(getExpensiveProduct);
productRouter.route('/latest').get(getLastAddedProduct);  // ✅ Fixed naming
productRouter.route('/by/:id').post(byProduct).put(changeProductById).patch(updateProductById);
productRouter.route('/:id').put(updateProductById).delete(deleteProductById);
productRouter.route('/delete-all').delete(deleteAllProduct);

export default productRouter;
