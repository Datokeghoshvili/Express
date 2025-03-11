import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keep your custom id field
    name: { type: String, required: [true, "Name is Required"] },
    category: { type: String, required: true },
    price: { type: Number, required: true,  validate:{validator:(value) => value > 0, message: "Price must be greater than 0"} },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    slug: { type: String },
    createdAt: { type: Date, default: Date.now },
  });
  
  // Create Mongoose Model
  const Product = mongoose.model('Product', productSchema);
export default Product  