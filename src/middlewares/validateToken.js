import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authRequired = async (req, res, next) => {
    try {   
        // El token se guarda en cabeceras y lo recuperamos de allí
        const token = req.headers.authorization;

        if (!token) {
            return res.status(404).json({msg: "El token es invalido o no existe", token: false});
        }

        // Asi nos llega de la cabecera 
        // Bearer TOKEN
        const parsedToken = token.replace('Bearer ', '');
        const validToken = jwt.verify(parsedToken, TOKEN_SECRET);

        const userLogued = await User.findById(validToken.id);

        if (!userLogued) {
            return res.status(404).json({msg: "Usuario no encontrado", token: false});
        }

        req.user = userLogued;
        next();
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return res.status(500).json({msg: "Error interno en el servidor"});
    }
};
