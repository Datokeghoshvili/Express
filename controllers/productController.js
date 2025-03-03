import fs from 'fs';
const data = fs.readFileSync('./data/product.json', 'utf8');
const backup = fs.copyFileSync('./data/product.json', './data/product-backup.json');
console.log('backup created', backup);

const getProducts = ('/', (req, res) => {
    res.json(JSON.parse( data))
  });
  
  // get products count
const getProductsCount= ('/products/count', (req, res) => {
    const products = JSON.parse(data);
    console.log('we have', products.length, 'products in database');
    res.json(products.length);
  });
  
  // Find the most expensive product
  const getExpensiveProduct=('/products/most-expensive', (req, res) => {
    const products = JSON.parse(data);
    if (products.length === 0) return res.status(404).json({ error: "No products available!" });
  
    const mostExpensive = products.reduce((max, product) => (product.price > max.price ? product : max), products[0]);
    res.json(mostExpensive);
  });
   // get lastest added product
  const getLastAddedProduct = ('/products/latest', (req, res) => {
    const products = JSON.parse(data);
    if (products.length === 0) return res.status(404).json({ error: "No products available!" });
    const latestProduct = products.reduce((max, product) => (product.createdAt > max.createdAt ? product : max), products[0]);
    res.json(latestProduct);
  }
  );
  
  
  // Create a new product
  const createProduct = ('/products', (req, res) => {
    const newProduct ={...req.body, createdAt: Date.now() , stock: 10 }
    const products = JSON.parse(data);
    const {name, price, id} = req.body;
    if (!name || !price ) {
      return res.status(400).json({error: 'name and price are required'});
    } 
     if (products.some(product => product.id === id)) {
      return res.status(400).json({ error: "Product already exists!" });
    }
  
    
    products.push(newProduct);
    fs.writeFileSync('./data/product.json', JSON.stringify(products));
    res.status(201).json(newProduct);
  });
  
  //Buy a product
  const byProduct = ('/products/by/:id', (req, res) => {
    const products = JSON.parse(data);
    const productIndex = products.findIndex(product => product.id === parseInt(req.params.id));
    products[productIndex].stock -= 1
    fs.writeFileSync('./data/product.json', JSON.stringify(products));
    res.status(201).json(products[productIndex].stock);
  
  
  });
  
  const changeProductById = ('/products/:id', (req, res) => {
    const products = JSON.parse(data);
    const productIndex = products.findIndex(product => product.id === parseInt(req.params.id));
    const newProduct = req.body
    products[productIndex] = newProduct;
    fs.writeFileSync('./data/product.json', JSON.stringify(products));
    res.json(productIndex);
  });
  const updateProductById = ('/products/:id', (req, res) => {  
    const products = JSON.parse(data);
    const productIndex = products.findIndex(product => product.id === parseInt(req.params.id));
    const newProduct = req.body
    products[productIndex] = {...products[productIndex], ...newProduct};
    fs.writeFileSync('./data/product.json', JSON.stringify(products));
    res.json(productIndex);
  });
  //delete a product by id
  const deleteProductById = ('/products/:id', (req, res) => {
    const products = JSON.parse(data);
    const newProducts = products.filter(product => product.id !== parseInt(req.params.id));
    fs.writeFileSync('./data/product.json', JSON.stringify(newProducts));
    res.json(newProducts);
  });
  

  const deleteAllProduct = ('/products/delete-all', (req, res) => {
    fs.writeFileSync('./data/product.json', JSON.stringify([]));
    res.json([]);
  });
export {getProducts, getProductsCount, getExpensiveProduct, getLastAddedProduct, createProduct, byProduct, changeProductById, updateProductById, deleteProductById, deleteAllProduct};
  