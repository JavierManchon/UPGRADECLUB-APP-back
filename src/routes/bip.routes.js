import express from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { getBips, createBip, getAllBips, deleteBip, updateBip, getBip } from '../controllers/bip.controller.js';
import { createBipSchema } from '../schemas/bip.schema.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {upload, uploadToCloudinary} from '../middlewares/file.middlewares.js';

const router = express.Router();

router.get('/all-bips', authRequired, getAllBips);
router.get('/bips', authRequired, getBips);
router.post('/create-bip', authRequired,[upload.single('picture'), uploadToCloudinary], validateSchema(createBipSchema), createBip);
router.get('/bips/:id', authRequired, getBip);
router.put('/bips/:id', authRequired, updateBip);
router.delete('/bips/:id', authRequired, deleteBip);

export default router;