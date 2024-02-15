import {Router} from 'express';
import { register, login, logout, profile, getUserByToken, patchUser, getUserById } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { upload } from '../middlewares/cloudinary.middleware.js';

const router = Router();

router.post('/register', validateSchema(registerSchema), register);

router.post('/login', validateSchema(loginSchema), login);

router.get('/get-user', getUserByToken);

router.get('/get-user/:id', getUserById);

router.patch('/edit/:id', upload.single('picture'),  patchUser);

router.post('/logout', logout);

router.post('/verify-token');

router.get('/profile', authRequired, profile);

export default router;