import fs from 'fs';
import mongoose from 'mongoose';

// Backup the JSON file 
fs.copyFileSync('./data/product.json', './data/product-backup.json');
console.log('Backup created');

// Define MongoosE Schema
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  slug: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Create Mongoose Model
const Product = mongoose.model('Product', productSchema);

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ productQuantity: products.length, products });
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
    const { name, price, id, description, stock } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ error: "Product already exists!" });
    }

    const newProduct = new Product({ id, name, price, description, stock: stock || 10 });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buy a product (reduce stock by 1)
const byProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ id });
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

//
//  Replace a product by id
const changeProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findOneAndReplace({ id }, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: "Product not found!" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product partially 
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findOneAndUpdate({ id }, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: "Product not found!" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product by ID
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findOneAndDelete({ id });
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
};
