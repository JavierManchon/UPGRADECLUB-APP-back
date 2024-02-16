import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { createComment, getComment, getComments, deleteComment } from '../controllers/comment.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createCommentSchema } from '../schemas/comment.schema.js';

const router = Router();

router.get('/comments/all/:id', authRequired, getComments);
router.get('/comments/:id', authRequired, getComment);
router.post('/create-comment/:id/:user', authRequired, validateSchema(createCommentSchema), createComment);
router.delete('/comments/:id', authRequired, deleteComment);

export default router;
