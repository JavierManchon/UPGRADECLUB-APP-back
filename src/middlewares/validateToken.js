
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js"

export const authRequired = async (req, res, next) => {
    try {
            
        // El token se guarda en cabeceras y lo recuperamos de allí
        const token = req.headers.authorization;

        if (!token) {
            res.status(404).json({msg: "El token es invalido o no existe", token: false})
            return 
        }
        // Asi nos llega de la cabecera 
        // Bearer TOKEN
        const parsedToken = token.replace('Bearer ', '');
        const validToken = JwtUtils.verifyToken(parsedToken, TOKEN_SECRET);
        const userLogued = await User.findById(validToken.id);
        req.user = userLogued;
        next();
    } catch (error) {
        error.statusToken = 'unauthorized'
        return next(error)
    }
};