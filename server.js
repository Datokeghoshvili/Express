import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL.replace('<db_password>', process.env.DB_PASSWORD).replace('<username>', process.env.DB_USER);

mongoose.connect(DB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message));

app.listen(PORT, () => {  
  console.log(`Server started on http://localhost:${PORT}`);
});
