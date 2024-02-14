import {z} from 'zod';

export const createCommentSchema = z.object({
    content: z.string({
        required_error: 'Content is required'
    }),
    date: z.string().optional(),
})