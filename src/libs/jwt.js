import { TOKEN_SECRET } from '../config.js';
import jwt from "jsonwebtoken";

export const generateToken = (id, email) => {
    const token = jwt.sign({ id, email }, TOKEN_SECRET, { expiresIn: '1d' });
    return token
}

export const verifyToken = (token) => {
    return jwt.verify(token, TOKEN_SECRET)
}