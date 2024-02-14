import { z } from 'zod';

export const createBipSchema = z.object({
    content: z.string({
        required_error: 'Content is required'
    })
});