import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Custom ID field
    name: { type: String, required: [true, "Name is required"] },
    category: { type: String, required: true },
    price: { 
        type: Number, 
        required: true,  
        validate: { 
            validator: (value) => value > 0, 
            message: "Price must be greater than 0" 
        } 
    },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    slug: { type: String },
    createdAt: { type: Date, default: Date.now },
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

productSchema.pre('findOneAndDelete', async function (next) {
  try {
    const product = await Product.findOne(this.getQuery());
    if (!product) return next(new Error('Product not found!'));
    if (product.stock < 1) return next(new Error('No stock available'));
    next();
  } catch (error) {
    next(error);
  }
});



productSchema.post('save', function (doc, next) {
    console.log('Product has been saved:', doc);
    next();
});

productSchema.virtual("status").get(function () {
    return this.stock > 0 ? 'In stock' : 'Out of stock';

});

const Product = mongoose.model('Product', productSchema);

export default Product;
