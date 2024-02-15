import { configDotenv } from 'dotenv';
import app from './app.js';
import { connectDB } from './db.js';
import { configCloudinary } from './utils/config.js';

configDotenv();
connectDB();
configCloudinary();
app.listen(3000);
console.log('Server on port', 3000);