import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import commentRoutes from './routes/comment.routes.js';
import bipRoutes from './routes/bip.routes.js';

const app = express();

app.use(cors({
    origin:'http://localhost:4200',
    credentials: true
}));
app.use(morgan('dev'));
//middleware para que express entienda json, y convierta los req.body
app.use(express.json());
app.use(cookieParser());

//Para que todas las rutas protegidas de authRoutes lleven delante /api
app.use('/api', authRoutes);
app.use('/api', commentRoutes);
app.use('/api', bipRoutes);

export default app;