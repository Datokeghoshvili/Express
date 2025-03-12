import fs from 'fs';
import Product from '../models/productModel.js';
import filterService from './services/filter.js';
// Backup the JSON file
fs.copyFileSync('./data/product.json', './data/product-backup.json');
console.log('Backup created');


// Get all products
const getProducts = async (req, res) => {
  const exclcudeFields = ['page', 'sort', 'limit', 'fields'];
  const queryObj = { ...req.query };
  
  try {
   const query = filterService(Product, queryObj);
    const products = await query;
    
    if (!products) return res.status(404).json({ error: "No products available!" });
    res.json(products);
    

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total product count
const getProductsCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    console.log('We have', count, 'products in the database');
    res.json(count);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find the most expensive product
const getExpensiveProduct = async (req, res) => {
  try {
    const mostExpensive = await Product.findOne().sort({ price: -1 });
    if (!mostExpensive) return res.status(404).json({ error: "No products available!" });
    res.json(mostExpensive);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the latest added product
const getLastAddedProduct = async (req, res) => {
  try {
    const latestProduct = await Product.findOne().sort({ createdAt: -1 });
    if (!latestProduct) return res.status(404).json({ error: "No products available!" });
    res.json(latestProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { id, name, price, description, stock, category } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ error: "Name, price, description, and category are required!" });
    }

    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ error: "Product already exists!" });
    }

    const newProduct = new Product({
      id,
      name,
      price,
      description,
      stock: stock || 10,
      category, 
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Buy a product (reduce stock by 1)
const byProduct = async (req, res) => {
  try {
    const { _id } = req.params; // Use MongoDB _id
    const product = await Product.findById(_id);
    if (!product) return res.status(404).json({ error: "Product not found!" });

    if (product.stock > 0) {
      product.stock -= 1;
      await product.save();
      res.status(200).json({ stock: product.stock });
    } else {
      res.status(400).json({ error: "Out of stock!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Replace a product  _id
const changeProductById = async (req, res) => {
  try {
    const { _id } =  req.params; // Use MongoDB _id
    const updatedProduct = await Product.findByIdAndReplace(_id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: "Product not found!" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product partially by  _id
const updateProductById = async (req, res) => {
  try {
    const { _id } = req.params; // Use MongoDB _id
    const updatedProduct = await Product.findByIdAndUpdate(_id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: "Product not found!" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product _id
const deleteProductById = async (req, res) => {
  try {
    const { _id } = req.params; 
    const deletedProduct = await Product.findByIdAndDelete(_id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found!" });
    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all products
const deleteAllProduct = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "All products deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $match: { category: { $exists: true } },
      },
      {
        $group: {
          _id: '$category',
          numProducts: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
   res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export {
  getProducts,
  getProductsCount,
  getExpensiveProduct,
  getLastAddedProduct,
  createProduct,
  byProduct,
  changeProductById,
  updateProductById,
  deleteProductById,
  deleteAllProduct,
  getCategoryStats
};
