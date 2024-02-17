import { configDotenv } from 'dotenv';
import app from './src/app.js';
import { connectDB } from './src/db.js';
import { configCloudinary } from './src/utils/config.js';

configDotenv();
connectDB();
configCloudinary();
app.listen(3000);
console.log('Server on port', 3000);